import logging

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models.sticker import Sticker
from app.seed.excel_parser import parse_excel

logger = logging.getLogger(__name__)


def seed_stickers_if_empty(db: Session) -> int:
    count = db.scalar(select(func.count()).select_from(Sticker)) or 0
    if count > 0:
        return count

    settings = get_settings()
    parsed = parse_excel(settings.stickers_excel_path)
    if not parsed:
        logger.warning("No stickers parsed from Excel at %s", settings.stickers_excel_path)
        return 0

    for item in parsed:
        db.add(
            Sticker(code=item.code, team=item.team, number=item.number),
        )
    db.commit()

    final_count = db.scalar(select(func.count()).select_from(Sticker)) or 0
    if final_count != 980:
        logger.info(
            "Sticker seed complete: %s codes imported (Excel TOTAL metadata says 980)",
            final_count,
        )
    else:
        logger.info("Sticker seed complete: %s codes imported", final_count)
    return final_count
