from core.database import Base

from sqlalchemy import true

from datetime import datetime, timezone

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
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    status: Mapped[bool] = mapped_column(
        default=True,
        server_default=true(),
        nullable=False,
    )

    user = relationship("User", back_populates="chats")
    client = relationship("Client", back_populates="chats")
    messages: Mapped[list["Message"]] = relationship(
        "Message",
        back_populates="chat"
    )

