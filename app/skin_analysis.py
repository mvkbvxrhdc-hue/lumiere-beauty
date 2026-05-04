import base64
import io
import math
from typing import Any

from PIL import Image, ImageOps


SAMPLE_SIZE = 300


def clamp(value: float, low: int = 0, high: int = 100) -> int:
    return round(max(low, min(high, value)))


def rgb_to_hsl(r: float, g: float, b: float) -> dict[str, float]:
    r /= 255
    g /= 255
    b /= 255
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    lightness = (max_c + min_c) / 2
    if max_c == min_c:
        return {"h": 0, "s": 0, "l": lightness}

    diff = max_c - min_c
    saturation = diff / (2 - max_c - min_c) if lightness > 0.5 else diff / (max_c + min_c)
    if max_c == r:
        hue = ((g - b) / diff + (6 if g < b else 0)) / 6
    elif max_c == g:
        hue = ((b - r) / diff + 2) / 6
    else:
        hue = ((r - g) / diff + 4) / 6
    return {"h": hue, "s": saturation, "l": lightness}


def derive_signals(pixel_stats: dict[str, Any]) -> dict[str, Any]:
    hsl = rgb_to_hsl(pixel_stats["meanR"], pixel_stats["meanG"], pixel_stats["meanB"])
    warmth = (pixel_stats["meanR"] - pixel_stats["meanB"]) / 255
    brightness = pixel_stats["brightness"]
    shine_signal = ((brightness - 0.62) / 0.38) ** 0.7 if brightness > 0.62 else 0
    dull_signal = ((0.40 - brightness) / 0.40) ** 0.6 if brightness < 0.40 else 0
    redness_signal = min(1, max(0, warmth * 1.4 + hsl["s"] * 0.6))
    yellow_index = ((pixel_stats["meanR"] + pixel_stats["meanG"]) / 2 - pixel_stats["meanB"]) / 255
    return {
        "hsl": hsl,
        "warmth": warmth,
        "shineSignal": shine_signal,
        "dullSignal": dull_signal,
        "rednessSignal": redness_signal,
        "yellowIndex": yellow_index,
    }


def classify_skin_type(pixel_stats: dict[str, Any], signals: dict[str, Any]) -> str:
    oily_score = signals["shineSignal"] * 60 + (pixel_stats["stdR"] / 128) * 25 + pixel_stats["textureFreq"] * 15
    dry_score = signals["dullSignal"] * 55 + (1 - signals["hsl"]["s"]) * 25 + (1 - pixel_stats["localContrast"]) * 20
    sensitive_score = signals["rednessSignal"] * 65 + signals["hsl"]["s"] * 35
    max_score = max(oily_score, dry_score, sensitive_score)
    if oily_score > 20 and dry_score > 20:
        return "Combination"
    if max_score == oily_score and oily_score > 18:
        return "Oily"
    if max_score == dry_score and dry_score > 16:
        return "Dry"
    if max_score == sensitive_score and sensitive_score > 22:
        return "Sensitive"
    return "Normal"


def compute_metrics(pixel_stats: dict[str, Any], signals: dict[str, Any]) -> dict[str, int]:
    shine_signal = signals["shineSignal"]
    dull_signal = signals["dullSignal"]
    redness_signal = signals["rednessSignal"]
    moisture_raw = (1 - shine_signal) * 0.45 + (1 - dull_signal) * 0.35 + (1 - pixel_stats["textureFreq"]) * 0.20
    oiliness_raw = shine_signal * 0.55 + signals["warmth"] * 0.25 + (pixel_stats["stdR"] / 128) * 0.20
    texture_raw = (1 - pixel_stats["textureFreq"]) * 0.65 + (1 - pixel_stats["localContrast"]) * 0.35
    clarity_raw = (1 - pixel_stats["entropy"]) * 0.60 + (1 - redness_signal * 0.8) * 0.40
    elasticity_raw = max(0, 1 - abs(pixel_stats["brightness"] - 0.55) * 2) * 0.70 + (1 - (pixel_stats["stdR"] / 128) * 0.5) * 0.30
    fine_lines_raw = pixel_stats["localContrast"] * 0.50 + pixel_stats["textureFreq"] * 0.35 + (1 - pixel_stats["brightness"]) * 0.15
    hyperpig_raw = max(0, signals["yellowIndex"] + 0.5) * 0.60 + pixel_stats["entropy"] * 0.40
    redness_raw = redness_signal * 0.70 + signals["hsl"]["s"] * 0.30
    pore_size_raw = pixel_stats["localContrast"] * 0.65 + pixel_stats["textureFreq"] * 0.35

    return {
        "moisture": clamp(moisture_raw * 100),
        "dehydrationLines": clamp((1 - moisture_raw) * 80 + pixel_stats["textureFreq"] * 20),
        "waterContent": clamp(moisture_raw * 92),
        "oiliness": clamp(oiliness_raw * 100),
        "sebumProduction": clamp(oiliness_raw * 88 + shine_signal * 12),
        "shineLevel": clamp(shine_signal * 100),
        "texture": clamp(texture_raw * 100),
        "clarity": clamp(clarity_raw * 100),
        "evenness": clamp((1 - pixel_stats["entropy"]) * 78 + (1 - abs(signals["warmth"])) * 22),
        "roughness": clamp(pixel_stats["textureFreq"] * 78 + pixel_stats["localContrast"] * 22),
        "elasticity": clamp(elasticity_raw * 100),
        "firmness": clamp(elasticity_raw * 92),
        "fineLines": clamp(fine_lines_raw * 100),
        "wrinkleDepth": clamp(fine_lines_raw * 72 + pixel_stats["localContrast"] * 28),
        "hyperpigmentation": clamp(hyperpig_raw * 100),
        "darkSpots": clamp(hyperpig_raw * 82 + pixel_stats["entropy"] * 18),
        "redness": clamp(redness_raw * 100),
        "sensitivity": clamp(redness_raw * 76 + signals["hsl"]["s"] * 24),
        "poreSize": clamp(pore_size_raw * 100),
        "poreClogging": clamp(pore_size_raw * 80 + oiliness_raw * 20),
    }


def compute_zone(zone: dict[str, Any]) -> dict[str, int]:
    hsl = rgb_to_hsl(zone["meanR"], zone["meanG"], zone["meanB"])
    shine = (zone["brightness"] - 0.62) / 0.38 if zone["brightness"] > 0.62 else 0
    warm = (zone["meanR"] - zone["meanB"]) / 255
    return {
        "moisture": clamp((1 - shine) * 60 + (1 - max(0, (0.4 - zone["brightness"]) / 0.4)) * 40),
        "oiliness": clamp(shine * 70 + max(0, warm) * 30),
        "texture": clamp((1 - (zone["std"] / 80)) * 65 + (1 - shine) * 35),
        "redness": clamp(max(0, warm) * 80 + hsl["s"] * 20),
        "pores": clamp((zone["std"] / 80) * 70 + shine * 30),
    }


def image_data_url_to_pixel_stats(image_data_url: str) -> dict[str, Any]:
    if "," in image_data_url and image_data_url.strip().lower().startswith("data:"):
        _, encoded = image_data_url.split(",", 1)
    else:
        encoded = image_data_url

    try:
        image_bytes = base64.b64decode(encoded, validate=True)
        image = Image.open(io.BytesIO(image_bytes))
    except Exception as exc:
        raise ValueError("Invalid image payload") from exc

    image = ImageOps.exif_transpose(image).convert("RGB")
    image = ImageOps.fit(image, (SAMPLE_SIZE, SAMPLE_SIZE), method=Image.Resampling.LANCZOS)
    pixels = list(image.getdata())
    pixel_count = len(pixels)

    sum_r = sum(pixel[0] for pixel in pixels)
    sum_g = sum(pixel[1] for pixel in pixels)
    sum_b = sum(pixel[2] for pixel in pixels)
    mean_r = sum_r / pixel_count
    mean_g = sum_g / pixel_count
    mean_b = sum_b / pixel_count

    var_r = sum((pixel[0] - mean_r) ** 2 for pixel in pixels) / pixel_count
    var_g = sum((pixel[1] - mean_g) ** 2 for pixel in pixels) / pixel_count
    var_b = sum((pixel[2] - mean_b) ** 2 for pixel in pixels) / pixel_count

    luminance = [
        pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114
        for pixel in pixels
    ]
    texture_total = sum(abs(luminance[i] - luminance[i - 1]) for i in range(1, pixel_count))
    texture_freq = texture_total / (pixel_count - 1) / 255

    histogram = [0] * 256
    for value in luminance:
        histogram[round(value)] += 1

    entropy = 0.0
    for count in histogram:
        if count:
            probability = count / pixel_count
            entropy -= probability * math.log2(probability)
    entropy /= 8

    local_contrast = _compute_local_contrast(luminance)
    third = SAMPLE_SIZE // 3

    return {
        "meanR": mean_r,
        "meanG": mean_g,
        "meanB": mean_b,
        "stdR": math.sqrt(var_r),
        "stdG": math.sqrt(var_g),
        "stdB": math.sqrt(var_b),
        "brightness": (mean_r + mean_g + mean_b) / 3 / 255,
        "textureFreq": texture_freq,
        "entropy": entropy,
        "localContrast": local_contrast,
        "imageQuality": _compute_image_quality(image, luminance),
        "zones": {
            "top": _build_zone(pixels, 0, third),
            "mid": _build_zone(pixels, third, third * 2),
            "bottom": _build_zone(pixels, third * 2, SAMPLE_SIZE),
        },
    }


def _compute_local_contrast(luminance: list[float]) -> float:
    window = 5
    values: list[float] = []
    for y in range(0, SAMPLE_SIZE - window, window):
        for x in range(0, SAMPLE_SIZE - window, window):
            block: list[float] = []
            for wy in range(window):
                start = (y + wy) * SAMPLE_SIZE + x
                block.extend(luminance[start : start + window])
            mean = sum(block) / len(block)
            variance = sum((value - mean) ** 2 for value in block) / len(block)
            values.append(math.sqrt(variance))
    return min(1, (sum(values) / len(values)) / 60)


def _build_zone(pixels: list[tuple[int, int, int]], row_start: int, row_end: int) -> dict[str, float]:
    zone_pixels: list[tuple[int, int, int]] = []
    for y in range(row_start, row_end):
        start = y * SAMPLE_SIZE
        zone_pixels.extend(pixels[start : start + SAMPLE_SIZE])

    count = len(zone_pixels)
    mean_r = sum(pixel[0] for pixel in zone_pixels) / count
    mean_g = sum(pixel[1] for pixel in zone_pixels) / count
    mean_b = sum(pixel[2] for pixel in zone_pixels) / count
    mean_luminance = mean_r * 0.299 + mean_g * 0.587 + mean_b * 0.114
    variance = sum(
        ((pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114) - mean_luminance) ** 2
        for pixel in zone_pixels
    ) / count

    return {
        "meanR": mean_r,
        "meanG": mean_g,
        "meanB": mean_b,
        "brightness": (mean_r + mean_g + mean_b) / 3 / 255,
        "std": math.sqrt(variance),
    }


def _compute_image_quality(image: Image.Image, luminance: list[float]) -> dict[str, Any]:
    average_luminance = sum(luminance) / len(luminance) / 255
    contrast = min(1, (max(luminance) - min(luminance)) / 255)
    laplacian_like = 0.0
    checks = 0
    for y in range(1, SAMPLE_SIZE - 1, 3):
        for x in range(1, SAMPLE_SIZE - 1, 3):
            center = luminance[y * SAMPLE_SIZE + x]
            neighbors = (
                luminance[(y - 1) * SAMPLE_SIZE + x]
                + luminance[(y + 1) * SAMPLE_SIZE + x]
                + luminance[y * SAMPLE_SIZE + x - 1]
                + luminance[y * SAMPLE_SIZE + x + 1]
            ) / 4
            laplacian_like += abs(center - neighbors)
            checks += 1
    sharpness = min(1, (laplacian_like / checks) / 18)

    issues: list[str] = []
    if average_luminance < 0.28:
        issues.append("Image is quite dark")
    if average_luminance > 0.82:
        issues.append("Image is overexposed")
    if sharpness < 0.12:
        issues.append("Image may be blurry")

    return {
        "width": image.width,
        "height": image.height,
        "brightness": round(average_luminance, 3),
        "contrast": round(contrast, 3),
        "sharpness": round(sharpness, 3),
        "issues": issues,
    }


def analyze_skin_pixels(pixel_stats: dict[str, Any]) -> dict[str, Any]:
    signals = derive_signals(pixel_stats)
    skin_type = classify_skin_type(pixel_stats, signals)
    metrics = compute_metrics(pixel_stats, signals)
    zones = pixel_stats["zones"]
    zone_breakdown = {
        "tZone": compute_zone(zones["top"]),
        "cheeks": compute_zone(zones["mid"]),
        "eyeArea": compute_zone(zones["bottom"]),
    }

    concerns: list[str] = []
    if metrics["oiliness"] > 62:
        concerns.append("Excess Sebum")
    if metrics["poreSize"] > 55:
        concerns.append("Enlarged Pores")
    if metrics["moisture"] < 45:
        concerns.append("Dehydration")
    if metrics["fineLines"] > 45:
        concerns.append("Fine Lines")
    if metrics["redness"] > 50:
        concerns.append("Redness")
    if metrics["hyperpigmentation"] > 45:
        concerns.append("Uneven Tone")
    if metrics["darkSpots"] > 42:
        concerns.append("Dark Spots")
    if metrics["roughness"] > 52:
        concerns.append("Uneven Texture")
    if metrics["clarity"] < 48:
        concerns.append("Dullness")
    if skin_type == "Sensitive":
        concerns.append("Irritation")

    health_score = clamp(
        metrics["moisture"] * 0.18
        + metrics["texture"] * 0.16
        + metrics["clarity"] * 0.16
        + metrics["elasticity"] * 0.15
        + (100 - metrics["redness"]) * 0.12
        + (100 - metrics["hyperpigmentation"]) * 0.12
        + (100 - metrics["fineLines"]) * 0.11
        - len(concerns) * 2
    )

    age_score = (metrics["fineLines"] + (100 - metrics["elasticity"])) / 2
    age_estimate = "40-50" if age_score > 65 else "35-45" if age_score > 50 else "28-38" if age_score > 38 else "22-32" if age_score > 25 else "18-26"
    confidence = clamp(75 + pixel_stats["brightness"] * 10 - pixel_stats["entropy"] * 8 - (1 - pixel_stats["localContrast"]) * 5)
    next_check_in = 21 if metrics["fineLines"] > 40 or len(concerns) > 3 else 30

    morning_routine = [
        {"step": 1, "product": "Gentle Cleanser", "why": f"Supports {skin_type.lower()} skin without stripping the barrier."},
        {"step": 2, "product": "Hydrating Toner", "why": f"Moisture score is {metrics['moisture']}/100, so hydration support helps balance the skin."},
        {"step": 3, "product": "Niacinamide or Vitamin C Serum", "why": "Targets visible pores, uneven tone, and barrier strength."},
        {"step": 4, "product": "Lightweight Moisturizer", "why": "Seals hydration while keeping the finish comfortable."},
        {"step": 5, "product": "Broad-Spectrum SPF 50+", "why": "Daily UV protection is the strongest prevention step for pigment and aging signals."},
    ]
    evening_routine = [
        {"step": 1, "product": "Makeup/SPF Remover", "why": "Removes oil-soluble residue before cleansing."},
        {"step": 2, "product": "pH-Balanced Cleanser", "why": "Cleans without disturbing the acid mantle."},
        {"step": 3, "product": "Repair Serum", "why": f"Targets your main signals: {', '.join(concerns[:3]) if concerns else 'maintenance'}."},
        {"step": 4, "product": "Barrier Cream", "why": "Supports overnight recovery and reduces water loss."},
    ]

    ingredients_to_use: list[dict[str, str]] = [
        {"name": "Ceramides", "benefit": "Reinforces the skin barrier and helps reduce water loss.", "priority": "medium"},
        {"name": "Squalane", "benefit": "A light, skin-compatible lipid suitable for most skin types.", "priority": "low"},
    ]
    if metrics["moisture"] < 55:
        ingredients_to_use.insert(0, {"name": "Hyaluronic Acid", "benefit": f"Moisture score is {metrics['moisture']}/100, so humectant hydration is useful.", "priority": "high"})
    if metrics["oiliness"] > 58:
        ingredients_to_use.insert(0, {"name": "Niacinamide", "benefit": f"Sebum score is {metrics['sebumProduction']}/100; niacinamide helps regulate oil and pores.", "priority": "high"})
    if metrics["redness"] > 45:
        ingredients_to_use.insert(0, {"name": "Centella Asiatica", "benefit": f"Redness score is {metrics['redness']}/100; cica helps calm visible sensitivity.", "priority": "high"})
    if metrics["hyperpigmentation"] > 40:
        ingredients_to_use.insert(0, {"name": "Vitamin C", "benefit": f"Pigmentation score is {metrics['hyperpigmentation']}/100; antioxidant care can help uneven tone.", "priority": "high"})

    ingredients_to_avoid = {
        "Sensitive": ["Synthetic fragrance", "Denatured alcohol", "Strong essential oils", "Harsh physical scrubs"],
        "Oily": ["Heavy occlusive creams", "Coconut oil", "Thick petrolatum-first formulas"],
        "Dry": ["Alcohol-heavy toners", "Sulfate-heavy cleansers", "Overuse of salicylic acid"],
    }.get(skin_type, ["Harsh scrubs", "High-fragrance formulas", "Over-exfoliation"])

    lifestyle_tips = [
        "Use SPF every morning and reapply outdoors.",
        "Keep sleep regular to support overnight skin repair.",
        "Introduce only one active ingredient at a time.",
        "Use soft, even lighting when repeating analysis for better comparison.",
    ]

    recommendations = [
        f"Your skin type is {skin_type}.",
        f"Primary concerns: {', '.join(concerns[:3]) if concerns else 'none strongly detected'}.",
        f"Next check-in recommended in {next_check_in} days.",
    ]

    return {
        "skinType": skin_type,
        "concerns": concerns,
        "healthScore": health_score,
        "ageEstimate": age_estimate,
        "detailedMetrics": metrics,
        "zoneBreakdown": zone_breakdown,
        "recommendations": recommendations,
        "morningRoutine": morning_routine,
        "eveningRoutine": evening_routine,
        "ingredientsToUse": ingredients_to_use,
        "ingredientsToAvoid": ingredients_to_avoid,
        "lifestyleTips": lifestyle_tips,
        "confidence": confidence,
        "trend": "improving" if health_score > 70 else "stable" if health_score > 55 else "declining",
        "nextCheckIn": next_check_in,
        "imageQuality": pixel_stats.get("imageQuality"),
    }
