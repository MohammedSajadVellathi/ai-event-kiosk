from fastapi import APIRouter

from app.config import settings
from app.football_templates import TEMPLATES
from app.models.schemas import Template

router = APIRouter(tags=["templates"])


@router.get("/templates", response_model=list[Template])
def get_templates():
    return [
        Template(
            id=t.id,
            title=t.title,
            premium=False,
            imageUrl=f"{settings.api_base_url}/template-images/{t.image_file}",
        )
        for t in TEMPLATES.values()
    ]
