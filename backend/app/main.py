import logging
from contextlib import asynccontextmanager

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

load_dotenv()

from app.config import settings
from app.routes import generate, templates

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings.templates_dir.mkdir(exist_ok=True)
    settings.outputs_dir.mkdir(exist_ok=True)
    yield


app = FastAPI(
    title="AI Football Avatar API",
    description="Generates AI football avatars via ComfyUI + InstantID on RunPod",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(templates.router)

settings.outputs_dir.mkdir(exist_ok=True)
app.mount("/outputs", StaticFiles(directory=str(settings.outputs_dir)), name="outputs")
app.mount("/template-images", StaticFiles(directory=str(settings.templates_dir)), name="template-images")


@app.get("/health", tags=["system"])
async def health():
    comfyui_status = "unreachable"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{settings.comfyui_url}/system_stats")
            comfyui_status = "reachable" if r.status_code == 200 else "error"
    except Exception:
        pass

    return {
        "status": "ok",
        "service": "ai-football-avatar-api",
        "comfyui": comfyui_status,
        "comfyui_url": settings.comfyui_url,
    }
