from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict



BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    FRONTEND_DIR: Path = BASE_DIR / "app" / "frontend"
    TEMPLATES_DIR: Path = FRONTEND_DIR / "templates"
    STATIC_DIR: Path = FRONTEND_DIR / "static"



settings = Settings()