from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.sticker import (
    CatalogResponse,
    MissingStickersResponse,
    ProgressResponse,
    StickerUpdateRequest,
    UserStickerState,
    UserStickersResponse,
)
from app.services import sticker_service

router = APIRouter(tags=["stickers"])


@router.get("/stickers", response_model=CatalogResponse)
def list_stickers(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> CatalogResponse:
    return sticker_service.get_catalog(db)


@router.get("/me/stickers", response_model=UserStickersResponse)
def my_stickers(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserStickersResponse:
    return sticker_service.get_user_stickers(db, user.id)


@router.get("/me/progress", response_model=ProgressResponse)
def my_progress(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ProgressResponse:
    return sticker_service.get_progress(db, user.id)


@router.get("/me/missing", response_model=MissingStickersResponse)
def my_missing(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> MissingStickersResponse:
    return sticker_service.get_missing(db, user.id)


@router.patch("/me/stickers/{sticker_id}", response_model=UserStickerState)
def update_my_sticker(
    sticker_id: int,
    body: StickerUpdateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> UserStickerState:
    try:
        return sticker_service.set_sticker_owned(db, user.id, sticker_id, body.owned)
    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Figurita no encontrada",
        ) from exc
