import base64
import json
import os
import uuid
import logging

import httpx
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.config import settings
from app.comfyui_client import fetch_output_image, poll_history, queue_prompt, upload_image
from app.football_templates import TEMPLATES
from app.models.schemas import GenerateResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["generation"])


@router.post("/generate", response_model=GenerateResponse)
async def generate(
    image: UploadFile = File(...),
    template_id: str = Form(default="trophy"),
):
    # ── Validate inputs ────────────────────────────────────────────────────────
    if template_id not in TEMPLATES:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown template '{template_id}'. Available: {list(TEMPLATES)}",
        )

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    template = TEMPLATES[template_id]

    # ── Check local template pose image exists ─────────────────────────────────
    if not template.image_path.exists():
        raise HTTPException(
            status_code=500,
            detail=(
                f"Template pose image not found: '{template.image_file}'. "
                f"Place it in the backend/templates/ folder."
            ),
        )

    # ── Check workflow file exists ─────────────────────────────────────────────
    if not settings.workflow_path.exists():
        raise HTTPException(
            status_code=500,
            detail="workflow_api.json not found. Place it in the backend/ folder.",
        )

    with open(settings.workflow_path) as f:
        workflow = json.load(f)

    selfie_bytes = await image.read()
    selfie_filename = f"{uuid.uuid4().hex}.jpg"

    try:
        async with httpx.AsyncClient() as client:
            # 1. Upload selfie to ComfyUI
            logger.info("Uploading selfie to ComfyUI...")
            selfie_name = await upload_image(client, selfie_bytes, selfie_filename)
            logger.info(f"Selfie uploaded as: {selfie_name}")

            # 2. Upload template pose image to ComfyUI
            logger.info(f"Uploading template image ({template.image_file})...")
            template_bytes = template.image_path.read_bytes()
            template_name = await upload_image(client, template_bytes, template.image_file)
            logger.info(f"Template image uploaded as: {template_name}")

            # 3. Inject the 3 dynamic values into the workflow
            #    Node 2 = selfie | Node 6 = pose reference | Node 9 = positive prompt
            workflow["2"]["inputs"]["image"] = selfie_name
            workflow["6"]["inputs"]["image"] = template_name
            workflow["9"]["inputs"]["text"] = template.prompt

            # 4. Queue the workflow
            logger.info(f"Queueing workflow for template='{template_id}'...")
            prompt_id = await queue_prompt(client, workflow)
            logger.info(f"Queued — prompt_id: {prompt_id}")

            # 5. Poll until generation is complete
            logger.info("Polling for result...")
            outputs = await poll_history(client, prompt_id)

            # 6. Fetch the generated image bytes
            logger.info("Fetching output image...")
            image_bytes_out = await fetch_output_image(client, outputs)

    except TimeoutError as e:
        logger.error(str(e))
        raise HTTPException(status_code=504, detail=str(e))
    except RuntimeError as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=str(e))
    except httpx.HTTPStatusError as e:
        logger.error(f"ComfyUI HTTP error: {e}")
        raise HTTPException(status_code=502, detail=f"ComfyUI error: {e.response.status_code}")
    except httpx.RequestError as e:
        logger.error(f"ComfyUI connection error: {e}")
        raise HTTPException(status_code=502, detail="Could not reach ComfyUI server")

    # Cloud (Render): no persistent disk — return base64 directly
    # Local: save to disk and return a static URL (keeps browser memory light)
    if os.getenv("RENDER"):
        b64 = base64.b64encode(image_bytes_out).decode()
        logger.info("Cloud mode: returning base64 image")
        return GenerateResponse(success=True, imageUrl=f"data:image/png;base64,{b64}")

    output_filename = f"{uuid.uuid4().hex}.png"
    output_path = settings.outputs_dir / output_filename
    output_path.write_bytes(image_bytes_out)
    _cleanup_old_outputs()
    image_url = f"{settings.api_base_url}/outputs/{output_filename}"
    logger.info(f"Image saved → {image_url}")
    return GenerateResponse(success=True, imageUrl=image_url)


def _cleanup_old_outputs(max_files: int = 20) -> None:
    """Keep only the most recent max_files outputs to avoid filling disk."""
    files = sorted(settings.outputs_dir.glob("*.png"), key=lambda p: p.stat().st_mtime)
    for old in files[:-max_files]:
        old.unlink(missing_ok=True)
