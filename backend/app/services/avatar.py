import base64
import asyncio
from app.models.schemas import GenerateResponse


async def process_avatar(image_bytes: bytes, content_type: str) -> GenerateResponse:
    """
    Avatar generation service.

    Currently returns a mock response (echoes the uploaded image).
    Replace this implementation with your AI pipeline:
      - Call Stable Diffusion / ComfyUI / Replicate / custom model
      - Apply the selected template style
      - Return the generated image URL or base64 data
    """
    # Simulate AI processing time
    await asyncio.sleep(2.5)

    # Mock: echo back the uploaded image as base64 data URL
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    image_url = f"data:{content_type};base64,{encoded}"

    return GenerateResponse(success=True, imageUrl=image_url)
