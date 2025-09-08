from sqlalchemy import Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.sql import func
from app.database.database import Base


class Conversion(Base):
    __tablename__ = "conversions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    file_name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    language: Mapped[str] = mapped_column(String, nullable=False)
    source_type: Mapped[str] = mapped_column(String, nullable=False)  # "pdf", "image", or "text"
    text_content: Mapped[str | None] = mapped_column(Text, nullable=True)  # If user directly inputs text
    audio_file_path: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Foreign key to user
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))

    # Relationship with user
    owner: Mapped["User"] = relationship("User", back_populates="conversions")
