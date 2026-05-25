from pydantic import BaseModel
from typing import Optional


class Template(BaseModel):
    id: str
    title: str
    premium: bool
    imageUrl: Optional[str] = None


class GenerateResponse(BaseModel):
    success: bool
    imageUrl: str
    error: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    service: str
