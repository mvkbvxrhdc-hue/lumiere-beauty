from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class SkinMeasurement(Base):
    __tablename__ = "skin_measurements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    device_id: Mapped[str] = mapped_column(String(80), index=True)
    user_id: Mapped[str | None] = mapped_column(String(80), index=True, nullable=True)
    skin_temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    skin_humidity_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    oil_level: Mapped[float | None] = mapped_column(Float, nullable=True)
    moisture_level: Mapped[float | None] = mapped_column(Float, nullable=True)
    ph_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    raw_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class ContentItem(Base):
    __tablename__ = "content_items"
    __table_args__ = (UniqueConstraint("kind", "slug", name="uq_content_items_kind_slug"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    kind: Mapped[str] = mapped_column(String(80), index=True)
    slug: Mapped[str] = mapped_column(String(160), index=True)
    title: Mapped[str | None] = mapped_column(String(240), nullable=True)
    payload: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(240), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(240), nullable=True)
    skin_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    main_concerns: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class RecommendationEvent(Base):
    __tablename__ = "recommendation_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str | None] = mapped_column(String(80), index=True, nullable=True)
    analysis_id: Mapped[int | None] = mapped_column(Integer, index=True, nullable=True)
    product_id: Mapped[str] = mapped_column(String(120), index=True)
    visible_rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rule_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    model_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    model_status: Mapped[str] = mapped_column(String(40), default="unknown", index=True)
    event_type: Mapped[str] = mapped_column(String(40), default="impression", index=True)
    context_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
