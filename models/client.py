from backend.core.database import Base
from datetime import datetime

from sqlalchemy import String, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column


class Client(Base):
    __tablename__ = 'clients'

    __table_args__ = (
        UniqueConstraint(
            "telephone",
            "email",
            name="uq_client_name_telephone_email"
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    telephone: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    status: Mapped[bool] = mapped_column(
        default=True,
        nullable=False
    )
