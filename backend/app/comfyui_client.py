import asyncio
import time
import uuid
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


async def upload_image(client: httpx.AsyncClient, image_bytes: bytes, filename: str) -> str:
    """
    Upload an image file to ComfyUI's input folder.
    Returns the filename ComfyUI assigned (may differ if renamed to avoid conflicts).
    """
    resp = await client.post(
        f"{settings.comfyui_url}/upload/image",
        files={"image": (filename, image_bytes, "image/jpeg")},
        data={"type": "input", "overwrite": "true"},
        timeout=30.0,
    )
    resp.raise_for_status()
    return resp.json()["name"]


async def queue_prompt(client: httpx.AsyncClient, workflow: dict) -> str:
    """
    Send the modified workflow to ComfyUI's queue.
    Returns the prompt_id used to poll for results.
    """
    payload = {
        "prompt": workflow,
        "client_id": str(uuid.uuid4()),
    }
    resp = await client.post(
        f"{settings.comfyui_url}/prompt",
        json=payload,
        timeout=30.0,
    )
    resp.raise_for_status()
    data = resp.json()

    if "error" in data:
        raise RuntimeError(f"ComfyUI rejected the workflow: {data['error']}")

    return data["prompt_id"]


async def poll_history(client: httpx.AsyncClient, prompt_id: str) -> dict:
    """
    Poll /history/{prompt_id} until outputs are ready.
    Returns the outputs dict from the completed job.
    Raises TimeoutError if generation takes longer than poll_timeout_s.
    """
    deadline = time.monotonic() + settings.poll_timeout_s

    while time.monotonic() < deadline:
        resp = await client.get(
            f"{settings.comfyui_url}/history/{prompt_id}",
            timeout=10.0,
        )
        resp.raise_for_status()
        history = resp.json()

        if prompt_id in history:
            job = history[prompt_id]

            # Check if ComfyUI reported an execution error
            status = job.get("status", {})
            if status.get("status_str") == "error":
                messages = status.get("messages", [])
                raise RuntimeError(f"ComfyUI generation error: {messages}")

            outputs = job.get("outputs", {})
            if outputs:
                return outputs

        await asyncio.sleep(settings.poll_interval_s)

    raise TimeoutError(
        f"Generation timed out after {settings.poll_timeout_s}s (prompt_id={prompt_id})"
    )


async def fetch_output_image(client: httpx.AsyncClient, outputs: dict) -> bytes:
    """
    Extract image info from the ComfyUI outputs dict and download the image bytes.
    ComfyUI outputs look like: { "node_id": { "images": [{ "filename": "...", "subfolder": "...", "type": "output" }] } }
    """
    for node_output in outputs.values():
        for img in node_output.get("images", []):
            resp = await client.get(
                f"{settings.comfyui_url}/view",
                params={
                    "filename": img["filename"],
                    "subfolder": img.get("subfolder", ""),
                    "type": img.get("type", "output"),
                },
                timeout=30.0,
            )
            resp.raise_for_status()
            return resp.content

    raise ValueError("No output image found in ComfyUI response")
