"""Central configuration, loaded from the environment / .env file."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    anthropic_api_key: str = ""
    claude_model: str = "claude-sonnet-5"
    max_tokens: int = 4096
    max_loop_iterations: int = 3
    # The frontend origin allowed by CORS. Comma-separate for multiple origins.
    frontend_url: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        origins = [o.strip() for o in self.frontend_url.split(",") if o.strip()]
        # Always allow the common local dev ports as a convenience.
        origins += ["http://localhost:3000", "http://localhost:5173"]
        return sorted(set(origins))


@lru_cache
def get_settings() -> Settings:
    return Settings()
