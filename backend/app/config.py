from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).parent.parent


class Settings(BaseSettings):
    comfyui_url: str = "http://localhost:8188"
    templates_dir: Path = BASE_DIR / "templates"
    outputs_dir: Path = BASE_DIR / "outputs"
    workflow_path: Path = BASE_DIR / "workflow_api.json"
    poll_interval_s: float = 2.0
    poll_timeout_s: float = 180.0
    api_base_url: str = "http://localhost:8000"

    model_config = {"env_file": str(BASE_DIR / ".env")}


settings = Settings()
