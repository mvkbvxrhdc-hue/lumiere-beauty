from .models import SkinMeasurement
from .schemas import AnalysisResult


def analyze_measurement(measurement: SkinMeasurement) -> AnalysisResult:
    moisture = measurement.moisture_level
    oil = measurement.oil_level
    humidity = measurement.skin_humidity_percent
    temperature = measurement.skin_temperature_c
    ph = measurement.ph_value

    score = 80
    suggestions: list[str] = []

    hydration_status = "数据不足"
    if moisture is not None:
        if moisture < 35:
            hydration_status = "偏干"
            score -= 18
            suggestions.append("当前皮肤水分偏低，建议加强基础保湿，减少过度清洁。")
        elif moisture > 70:
            hydration_status = "水分较高"
            suggestions.append("皮肤水分状态较好，注意维持稳定护理即可。")
        else:
            hydration_status = "正常"

    oil_status = "数据不足"
    if oil is not None:
        if oil < 25:
            oil_status = "油脂偏低"
            score -= 8
            suggestions.append("皮脂水平偏低，建议使用温和洁面并增加滋润型产品。")
        elif oil > 65:
            oil_status = "油脂偏高"
            score -= 12
            suggestions.append("皮脂水平偏高，建议选择清爽型保湿产品，避免厚重油性护肤品。")
        else:
            oil_status = "正常"

    sensitivity_risk = "低"
    if temperature is not None and temperature >= 34.5:
        sensitivity_risk = "中"
        score -= 8
        suggestions.append("皮肤表面温度偏高，可能与环境、运动或敏感状态有关，建议稍后复测。")
    if ph is not None and (ph < 4.5 or ph > 6.5):
        sensitivity_risk = "中" if sensitivity_risk == "低" else "较高"
        score -= 10
        suggestions.append("pH 数值偏离常见皮肤弱酸范围，建议避免刺激性产品并持续观察。")
    if humidity is not None and humidity < 30:
        score -= 5
        suggestions.append("环境或皮肤表面湿度偏低，建议注意补水保湿和环境湿度。")

    skin_type = infer_skin_type(moisture, oil)
    if not suggestions:
        suggestions.append("当前基础指标较稳定，建议保持规律清洁、防晒和保湿。")

    score = max(0, min(100, score))
    summary = f"初步判断为{skin_type}，水分状态{hydration_status}，油脂状态{oil_status}，敏感风险{sensitivity_risk}。"

    return AnalysisResult(
        skin_type=skin_type,
        hydration_status=hydration_status,
        oil_status=oil_status,
        sensitivity_risk=sensitivity_risk,
        score=score,
        summary=summary,
        suggestions=suggestions,
    )


def infer_skin_type(moisture: float | None, oil: float | None) -> str:
    if moisture is None or oil is None:
        return "待补充数据"
    if moisture < 35 and oil < 45:
        return "干性倾向"
    if moisture < 40 and oil >= 65:
        return "外油内干倾向"
    if oil >= 65:
        return "油性倾向"
    if 35 <= moisture <= 70 and 25 <= oil <= 65:
        return "中性或混合性倾向"
    return "需要复测确认"
