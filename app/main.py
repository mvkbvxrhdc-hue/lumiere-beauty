import json
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from .analysis import analyze_measurement
from .database import Base, engine, get_db
from .demo_content import DEMO_CONTENT_ITEMS
from .models import ContentItem, RecommendationEvent, SkinMeasurement, UserProfile
from .ml_skin_model import merge_model_analysis
from .product_recommendation_model import score_shadow_recommendations
from .schemas import (
    ContentItemCreate,
    ContentItemResponse,
    M5StackTemperatureCreate,
    MeasurementCreate,
    MeasurementResponse,
    RecommendationShadowRequest,
    RecommendationShadowResponse,
    RecommendationShadowScore,
    UserProfileCreate,
    UserProfileResponse,
)
from .skin_analysis import analyze_skin_pixels, image_data_url_to_pixel_stats


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Skin Detection Backend",
    description="美容皮肤检测项目后端 MVP：接收硬件数据、保存记录、分析状态并返回建议。",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS",
            "http://127.0.0.1:3000,http://localhost:3000,http://127.0.0.1:3001,http://localhost:3001",
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/skin-analysis")
def create_skin_analysis(payload: dict, db: Session = Depends(get_db)) -> dict:
    image_data_url = payload.get("imageDataUrl")
    if isinstance(image_data_url, str) and image_data_url:
        try:
            pixel_stats = image_data_url_to_pixel_stats(image_data_url)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        result = merge_model_analysis(analyze_skin_pixels(pixel_stats), pixel_stats, image_data_url)
        return persist_analysis_if_requested(db, payload, pixel_stats, result)

    pixel_stats = payload.get("pixelStats")
    if not isinstance(pixel_stats, dict) or not isinstance(pixel_stats.get("meanR"), (int, float)):
        raise HTTPException(status_code=400, detail="Invalid image or pixel stats payload")
    result = merge_model_analysis(analyze_skin_pixels(pixel_stats), pixel_stats, payload.get("imageDataUrl"))
    return persist_analysis_if_requested(db, payload, pixel_stats, result)


@app.post("/api/v1/measurements", response_model=MeasurementResponse)
def create_measurement(
    payload: MeasurementCreate,
    db: Session = Depends(get_db),
) -> MeasurementResponse:
    measurement = save_measurement(db, payload)
    return to_response(measurement)


@app.post("/api/v1/devices/m5stack/temperature", response_model=MeasurementResponse)
def create_m5stack_temperature_measurement(
    payload: M5StackTemperatureCreate,
    db: Session = Depends(get_db),
) -> MeasurementResponse:
    raw_payload = {
        "source": payload.source,
        "sensor_type": payload.sensor_type,
        "firmware_version": payload.firmware_version,
        "wifi_rssi": payload.wifi_rssi,
    }
    if payload.raw_payload:
        raw_payload.update(payload.raw_payload)

    measurement_payload = MeasurementCreate(
        device_id=payload.device_id,
        user_id=payload.user_id,
        skin_temperature_c=payload.temperature_c,
        skin_humidity_percent=payload.humidity_percent,
        oil_level=None,
        moisture_level=None,
        ph_value=None,
        raw_payload=raw_payload,
    )
    measurement = save_measurement(db, measurement_payload)
    return to_response(measurement)


@app.get("/api/v1/measurements", response_model=list[MeasurementResponse])
def list_measurements(
    device_id: str | None = None,
    user_id: str | None = None,
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> list[MeasurementResponse]:
    query = select(SkinMeasurement).order_by(SkinMeasurement.created_at.desc()).limit(limit)
    if device_id:
        query = query.where(SkinMeasurement.device_id == device_id)
    if user_id:
        query = query.where(SkinMeasurement.user_id == user_id)

    measurements = db.scalars(query).all()
    return [to_response(item) for item in measurements]


@app.get("/api/v1/measurements/{measurement_id}", response_model=MeasurementResponse)
def get_measurement(
    measurement_id: int,
    db: Session = Depends(get_db),
) -> MeasurementResponse:
    measurement = db.get(SkinMeasurement, measurement_id)
    if measurement is None:
        raise HTTPException(status_code=404, detail="Measurement not found")
    return to_response(measurement)


@app.get("/api/v1/content/{kind}", response_model=list[ContentItemResponse])
def list_content_items(
    kind: str,
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> list[ContentItemResponse]:
    query = select(ContentItem).where(ContentItem.kind == kind).order_by(ContentItem.created_at.desc()).limit(limit)
    items = db.scalars(query).all()
    return [to_content_response(item) for item in items]


@app.get("/api/v1/content/{kind}/{slug}", response_model=ContentItemResponse)
def get_content_item(
    kind: str,
    slug: str,
    db: Session = Depends(get_db),
) -> ContentItemResponse:
    item = db.scalar(select(ContentItem).where(ContentItem.kind == kind, ContentItem.slug == slug))
    if item is None:
        raise HTTPException(status_code=404, detail="Content item not found")
    return to_content_response(item)


@app.post("/api/v1/content", response_model=ContentItemResponse)
def upsert_content_item(
    payload: ContentItemCreate,
    db: Session = Depends(get_db),
) -> ContentItemResponse:
    item = db.scalar(select(ContentItem).where(ContentItem.kind == payload.kind, ContentItem.slug == payload.slug))
    serialized_payload = json.dumps(payload.payload, ensure_ascii=False)
    if item is None:
        item = ContentItem(
            kind=payload.kind,
            slug=payload.slug,
            title=payload.title,
            payload=serialized_payload,
        )
        db.add(item)
    else:
        item.title = payload.title
        item.payload = serialized_payload
    db.commit()
    db.refresh(item)
    return to_content_response(item)


@app.post("/api/v1/seed-demo-content")
def seed_demo_content(db: Session = Depends(get_db)) -> dict[str, int | str]:
    created = 0
    updated = 0
    for entry in DEMO_CONTENT_ITEMS:
        item = db.scalar(
            select(ContentItem).where(
                ContentItem.kind == entry["kind"],
                ContentItem.slug == entry["slug"],
            )
        )
        serialized_payload = json.dumps(entry["payload"], ensure_ascii=False)
        if item is None:
            db.add(
                ContentItem(
                    kind=entry["kind"],
                    slug=entry["slug"],
                    title=entry.get("title"),
                    payload=serialized_payload,
                )
            )
            created += 1
        else:
            item.title = entry.get("title")
            item.payload = serialized_payload
            updated += 1
    db.commit()
    return {
        "status": "ok",
        "created": created,
        "updated": updated,
        "total": len(DEMO_CONTENT_ITEMS),
    }


@app.post("/api/v1/users/profile", response_model=UserProfileResponse)
def upsert_user_profile(
    payload: UserProfileCreate,
    db: Session = Depends(get_db),
) -> UserProfileResponse:
    email = payload.email.lower()
    profile = db.scalar(select(UserProfile).where(UserProfile.email == email))
    concerns = json.dumps(payload.main_concerns, ensure_ascii=False)
    if profile is None:
        profile = UserProfile(
            email=email,
            full_name=payload.full_name,
            skin_type=payload.skin_type,
            main_concerns=concerns,
        )
        db.add(profile)
    else:
        profile.full_name = payload.full_name
        profile.skin_type = payload.skin_type
        profile.main_concerns = concerns
    db.commit()
    db.refresh(profile)
    return to_user_profile_response(profile)


@app.get("/api/v1/users/profile/{email}", response_model=UserProfileResponse)
def get_user_profile(email: str, db: Session = Depends(get_db)) -> UserProfileResponse:
    profile = db.scalar(select(UserProfile).where(UserProfile.email == email.lower()))
    if profile is None:
        raise HTTPException(status_code=404, detail="User profile not found")
    return to_user_profile_response(profile)


@app.post("/api/v1/recommendations/shadow-score", response_model=RecommendationShadowResponse)
def shadow_score_recommendations(
    payload: RecommendationShadowRequest,
    db: Session = Depends(get_db),
) -> RecommendationShadowResponse:
    items = [item.model_dump(mode="json") for item in payload.items]
    scores = score_shadow_recommendations(payload.analysis, items)
    score_by_product = {score["product_id"]: score for score in scores}
    stored_events = 0

    for item in payload.items:
        product_id = item.product.id
        score = score_by_product.get(product_id, {})
        event_context = {
            "analysis": payload.analysis,
            "product": item.product.model_dump(mode="json"),
            "reasons": item.reasons,
            "topFeatureSignals": score.get("top_feature_signals", []),
        }
        db.add(
            RecommendationEvent(
                user_id=payload.user_id,
                analysis_id=payload.analysis_id,
                product_id=product_id,
                visible_rank=item.visible_rank,
                rule_score=item.rule_score,
                model_score=score.get("model_score"),
                model_status=score.get("model_status", "unknown"),
                event_type=payload.event_type,
                context_payload=json.dumps(event_context, ensure_ascii=False),
            )
        )
        stored_events += 1

    db.commit()
    model_status = "active" if any(score.get("model_status") == "active" for score in scores) else "fallback"
    return RecommendationShadowResponse(
        status="ok",
        model_status=model_status,
        stored_events=stored_events,
        scores=[RecommendationShadowScore(**score) for score in scores],
    )


def save_measurement(db: Session, payload: MeasurementCreate) -> SkinMeasurement:
    measurement = SkinMeasurement(
        device_id=payload.device_id,
        user_id=payload.user_id,
        skin_temperature_c=payload.skin_temperature_c,
        skin_humidity_percent=payload.skin_humidity_percent,
        oil_level=payload.oil_level,
        moisture_level=payload.moisture_level,
        ph_value=payload.ph_value,
        raw_payload=json.dumps(payload.raw_payload, ensure_ascii=False) if payload.raw_payload else None,
    )
    db.add(measurement)
    db.commit()
    db.refresh(measurement)
    return measurement


def persist_analysis_if_requested(
    db: Session,
    payload: dict,
    pixel_stats: dict,
    result: dict,
) -> dict:
    if not payload.get("saveMeasurement", False):
        return result

    metrics = result.get("detailedMetrics", {})
    measurement_payload = MeasurementCreate(
        device_id=str(payload.get("deviceId") or "frontend-skin-analysis"),
        user_id=payload.get("userId"),
        skin_temperature_c=payload.get("skinTemperatureC"),
        skin_humidity_percent=payload.get("skinHumidityPercent"),
        oil_level=metrics.get("oiliness"),
        moisture_level=metrics.get("moisture"),
        ph_value=payload.get("phValue"),
        raw_payload={
            "source": "frontend-skin-analysis",
            "pixelStats": pixel_stats,
            "analysis": result,
            "frontendAnalysis": payload.get("frontendAnalysis"),
        },
    )
    measurement = save_measurement(db, measurement_payload)
    return {**result, "measurement": to_response(measurement).model_dump(mode="json")}


def to_response(measurement: SkinMeasurement) -> MeasurementResponse:
    return MeasurementResponse(
        id=measurement.id,
        device_id=measurement.device_id,
        user_id=measurement.user_id,
        skin_temperature_c=measurement.skin_temperature_c,
        skin_humidity_percent=measurement.skin_humidity_percent,
        oil_level=measurement.oil_level,
        moisture_level=measurement.moisture_level,
        ph_value=measurement.ph_value,
        created_at=measurement.created_at,
        analysis=analyze_measurement(measurement),
    )


def to_content_response(item: ContentItem) -> ContentItemResponse:
    return ContentItemResponse(
        id=item.id,
        kind=item.kind,
        slug=item.slug,
        title=item.title,
        payload=json.loads(item.payload),
        created_at=item.created_at,
    )


def to_user_profile_response(profile: UserProfile) -> UserProfileResponse:
    return UserProfileResponse(
        id=profile.id,
        email=profile.email,
        full_name=profile.full_name,
        skin_type=profile.skin_type,
        main_concerns=json.loads(profile.main_concerns or "[]"),
        created_at=profile.created_at,
    )
