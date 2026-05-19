from pydantic import BaseModel, Field


class StickerItem(BaseModel):
    id: int
    code: str
    number: int


class TeamGroup(BaseModel):
    team: str
    stickers: list[StickerItem]


class CatalogResponse(BaseModel):
    teams: list[TeamGroup]


class UserStickerState(BaseModel):
    sticker_id: int
    code: str
    owned: bool


class UserStickersResponse(BaseModel):
    items: list[UserStickerState]


class ProgressResponse(BaseModel):
    total: int
    obtained: int
    missing: int
    percent: float


class StickerUpdateRequest(BaseModel):
    owned: bool | None = None


class MissingTeamGroup(BaseModel):
    team: str
    codes: list[str]


class MissingStickersResponse(BaseModel):
    total_missing: int
    teams: list[MissingTeamGroup]
