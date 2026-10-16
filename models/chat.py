from backend.core.database import Base

from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from sqlalchemy.orm import Mapped, mapped_column, relationship


class Chat(Base):
    __tablename__ = 'chats'

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    subject: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="chats")
    client = relationship("Client", back_populates="chats")

