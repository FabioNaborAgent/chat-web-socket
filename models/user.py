from core.database import Base

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column


class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    status: Mapped[bool] = mapped_column(
        default=False,
        nullable=False
    )