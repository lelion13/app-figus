from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://figus:figus@localhost:5432/figus"
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_expire_minutes: int = 10080
    jwt_alg: str = "HS256"
    cors_origins: str = "http://localhost:5173,https://figus.lionapp.cloud"
    stickers_excel_path: str = str(
        Path(__file__).resolve().parents[3] / "data" / "excel-control-album-panini-mundial-2026.xlsx"
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
