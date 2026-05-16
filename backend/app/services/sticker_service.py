from collections import OrderedDict

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.sticker import Sticker
from app.models.user_sticker import UserSticker
from app.schemas.sticker import (
    CatalogResponse,
    ProgressResponse,
    StickerItem,
    TeamGroup,
    UserStickerState,
    UserStickersResponse,
)


def get_catalog(db: Session) -> CatalogResponse:
    stickers = db.scalars(select(Sticker).order_by(Sticker.id)).all()
    teams: OrderedDict[str, list[StickerItem]] = OrderedDict()
    for sticker in stickers:
        if sticker.team not in teams:
            teams[sticker.team] = []
        teams[sticker.team].append(
            StickerItem(id=sticker.id, code=sticker.code, number=sticker.number)
        )
    return CatalogResponse(
        teams=[TeamGroup(team=team, stickers=items) for team, items in teams.items()]
    )


def get_user_stickers(db: Session, user_id: int) -> UserStickersResponse:
    rows = db.execute(
        select(UserSticker, Sticker)
        .join(Sticker, Sticker.id == UserSticker.sticker_id)
        .where(UserSticker.user_id == user_id)
    ).all()
    items = [
        UserStickerState(sticker_id=sticker.id, code=sticker.code, owned=us.owned)
        for us, sticker in rows
    ]
    return UserStickersResponse(items=items)


def get_progress(db: Session, user_id: int) -> ProgressResponse:
    total = db.scalar(select(func.count()).select_from(Sticker)) or 0
    obtained = (
        db.scalar(
            select(func.count())
            .select_from(UserSticker)
            .where(UserSticker.user_id == user_id, UserSticker.owned.is_(True))
        )
        or 0
    )
    missing = max(total - obtained, 0)
    percent = round((obtained / total) * 100, 1) if total > 0 else 0.0
    return ProgressResponse(
        total=total, obtained=obtained, missing=missing, percent=percent
    )


def set_sticker_owned(
    db: Session, user_id: int, sticker_id: int, owned: bool | None
) -> UserStickerState:
    sticker = db.scalar(select(Sticker).where(Sticker.id == sticker_id))
    if sticker is None:
        raise LookupError("sticker_not_found")

    row = db.scalar(
        select(UserSticker).where(
            UserSticker.user_id == user_id, UserSticker.sticker_id == sticker_id
        )
    )

    if row is None:
        new_owned = True if owned is None else owned
        row = UserSticker(user_id=user_id, sticker_id=sticker_id, owned=new_owned)
        db.add(row)
    else:
        if owned is None:
            row.owned = not row.owned
        else:
            row.owned = owned

    db.commit()
    db.refresh(row)
    return UserStickerState(sticker_id=sticker.id, code=sticker.code, owned=row.owned)
