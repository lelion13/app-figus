from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User


def normalize_email(email: str) -> str:
    return email.strip().lower()


def normalize_nickname(nickname: str) -> str:
    return nickname.strip()


def register_user(db: Session, nickname: str, email: str, password: str) -> User:
    email_norm = normalize_email(email)
    nickname_norm = normalize_nickname(nickname)

    existing_email = db.scalar(select(User).where(func.lower(User.email) == email_norm))
    if existing_email:
        raise ValueError("email_exists")

    existing_nick = db.scalar(
        select(User).where(func.lower(User.nickname) == nickname_norm.lower())
    )
    if existing_nick:
        raise ValueError("nickname_exists")

    user = User(
        nickname=nickname_norm,
        email=email_norm,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    email_norm = normalize_email(email)
    user = db.scalar(select(User).where(func.lower(User.email) == email_norm))
    if user is None or not verify_password(password, user.password_hash):
        return None
    return user
