from sqlalchemy import Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserSticker(Base):
    __tablename__ = "user_stickers"
    __table_args__ = (UniqueConstraint("user_id", "sticker_id", name="uq_user_sticker"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    sticker_id: Mapped[int] = mapped_column(ForeignKey("stickers.id", ondelete="CASCADE"))
    owned: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="user_stickers")
    sticker: Mapped["Sticker"] = relationship(back_populates="user_stickers")
