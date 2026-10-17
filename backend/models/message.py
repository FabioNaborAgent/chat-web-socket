from core.database import Base

from datetime import datetime

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Message(Base):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chats.id"),
        nullable=False
    )

    is_client: Mapped[bool] = mapped_column(
        default=True,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    message:Mapped[str] = mapped_column(
        String(255),
    )

    chat = relationship("Chat", back_populates="messages")