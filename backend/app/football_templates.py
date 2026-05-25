from dataclasses import dataclass
from pathlib import Path
from typing import Dict

from app.config import settings


@dataclass
class FootballTemplate:
    id: str
    title: str
    image_file: str  # filename inside backend/templates/ folder
    prompt: str

    @property
    def image_path(self) -> Path:
        return settings.templates_dir / self.image_file


TEMPLATES: Dict[str, FootballTemplate] = {
    "trophy": FootballTemplate(
        id="trophy",
        title="Trophy",
        image_file="trophy.png",
        prompt=(
            "ultra realistic football player holding the FIFA World Cup trophy in one hand, "
            "standing proudly, front-facing body, medium full body composition, "
            "professional football jersey, championship celebration atmosphere, "
            "dramatic stadium floodlights, cinematic sports photography, "
            "gold confetti falling, focused confident expression, sharp jawline, "
            "realistic skin texture, high contrast lighting, photorealistic, "
            "sports poster composition, highly detailed, 8k ultra detailed, "
            "epic stadium background, depth of field, sharp focus, "
            "premium sports advertisement style"
        ),
    ),
    "goalkeeper": FootballTemplate(
        id="goalkeeper",
        title="Goalkeeper",
        image_file="goalkeeper.png",
        prompt=(
            "ultra realistic football goalkeeper standing in the center of the goalpost, "
            "penalty save stance, legs apart, hands ready, focused expression, "
            "goalkeeper gloves, professional goalkeeper uniform, front-facing body, "
            "full body visible, dramatic stadium floodlights, night football stadium, "
            "cinematic sports photography, highly detailed, photorealistic, "
            "sharp focus, sports poster composition, centered framing, "
            "realistic skin texture, high contrast lighting, epic atmosphere, "
            "8k ultra detailed"
        ),
    ),
}
