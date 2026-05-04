from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class MeasurementCreate(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=80)
    user_id: str | None = Field(default=None, max_length=80)
    skin_temperature_c: float | None = Field(default=None, ge=0, le=60)
    skin_humidity_percent: float | None = Field(default=None, ge=0, le=100)
    oil_level: float | None = Field(default=None, ge=0, le=100)
    moisture_level: float | None = Field(default=None, ge=0, le=100)
    ph_value: float | None = Field(default=None, ge=0, le=14)
    raw_payload: dict[str, Any] | None = None


class M5StackTemperatureCreate(BaseModel):
    device_id: str = Field(..., min_length=1, max_length=80)
    temperature_c: float = Field(..., ge=-40, le=125)
    user_id: str | None = Field(default=None, max_length=80)
    humidity_percent: float | None = Field(default=None, ge=0, le=100)
    firmware_version: str | None = Field(default=None, max_length=80)
    wifi_rssi: int | None = Field(default=None, ge=-120, le=0)
    sensor_type: str | None = Field(default="temperature", max_length=80)
    source: str | None = Field(default="uiflow2", max_length=80)
    raw_payload: dict[str, Any] | None = None


class AnalysisResult(BaseModel):
    skin_type: str
    hydration_status: str
    oil_status: str
    sensitivity_risk: str
    score: int
    summary: str
    suggestions: list[str]


class MeasurementResponse(BaseModel):
    id: int
    device_id: str
    user_id: str | None
    skin_temperature_c: float | None
    skin_humidity_percent: float | None
    oil_level: float | None
    moisture_level: float | None
    ph_value: float | None
    created_at: datetime
    analysis: AnalysisResult

    model_config = {"from_attributes": True}


class ContentItemCreate(BaseModel):
    kind: str = Field(..., min_length=1, max_length=80)
    slug: str = Field(..., min_length=1, max_length=160)
    title: str | None = Field(default=None, max_length=240)
    payload: dict[str, Any]


class ContentItemResponse(BaseModel):
    id: int
    kind: str
    slug: str
    title: str | None
    payload: dict[str, Any]
    created_at: datetime


class UserProfileCreate(BaseModel):
    email: str = Field(..., min_length=3, max_length=240)
    full_name: str | None = Field(default=None, max_length=240)
    skin_type: str | None = Field(default=None, max_length=80)
    main_concerns: list[str] = Field(default_factory=list)


class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str | None
    skin_type: str | None
    main_concerns: list[str]
    created_at: datetime


class RecommendationProductPayload(BaseModel):
    id: str = Field(..., min_length=1, max_length=120)
    name: str | None = Field(default=None, max_length=240)
    brand: str | None = Field(default=None, max_length=120)
    category: str | None = Field(default=None, max_length=120)
    description: str | None = None
    skin_types: list[str] = Field(default_factory=list)
    highlights: list[str] = Field(default_factory=list)
    rating: float | None = Field(default=None, ge=0, le=5)
    price: float | None = Field(default=None, ge=0)
    in_stock: bool | None = None


class RecommendationShadowItem(BaseModel):
    product: RecommendationProductPayload
    visible_rank: int = Field(..., ge=1, le=100)
    rule_score: float = Field(..., ge=0)
    reasons: list[str] = Field(default_factory=list)


class RecommendationShadowRequest(BaseModel):
    user_id: str | None = Field(default=None, max_length=80)
    analysis_id: int | None = None
    analysis: dict[str, Any]
    items: list[RecommendationShadowItem]
    event_type: str = Field(default="impression", max_length=40)


class RecommendationShadowScore(BaseModel):
    product_id: str
    visible_rank: int
    rule_score: float
    model_score: float | None
    model_status: str
    algorithm: str | None = None
    confidence: float | None
    top_feature_signals: list[dict[str, Any]]


class RecommendationShadowResponse(BaseModel):
    status: str
    model_status: str
    stored_events: int
    scores: list[RecommendationShadowScore]
