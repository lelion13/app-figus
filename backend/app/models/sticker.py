from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Sticker(Base):
    __tablename__ = "stickers"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    team: Mapped[str] = mapped_column(String(128), index=True)
    number: Mapped[int] = mapped_column(Integer)

    user_stickers: Mapped[list["UserSticker"]] = relationship(back_populates="sticker")
