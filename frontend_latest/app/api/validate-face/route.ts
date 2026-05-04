import { type NextRequest, NextResponse } from "next/server"

async function detectSkin(imageData: string): Promise<{ valid: boolean; confidence: number; reason?: string }> {
  try {
    const base64Data = imageData.split(",")[1] || imageData

    if (!imageData.startsWith("data:image/")) {
      return { valid: false, confidence: 0, reason: "Invalid image format" }
    }

    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const sizeInBytes = bytes.length
    if (sizeInBytes < 5000) {
      return { valid: false, confidence: 0, reason: "Image file too small" }
    }

    let totalSamples = 0
    const sampleRate = 12
    let redSum = 0,
      greenSum = 0,
      blueSum = 0
    let skinPixels = 0
    let warmTonePixels = 0
    let coolTonePixels = 0
    let skinClusters = 0
    let consecutiveSkin = 0
    const brightnessHistogram: number[] = new Array(256).fill(0)

    for (let i = 0; i < Math.min(bytes.length - 3, 100000); i += sampleRate) {
      const r = bytes[i]
      const g = bytes[i + 1]
      const b = bytes[i + 2]

      totalSamples++
      redSum += r
      greenSum += g
      blueSum += b

      const brightness = Math.floor((r + g + b) / 3)
      brightnessHistogram[brightness]++

      // Strict skin tone detection with 6 criteria
      const isSkinTone =
        r > g + 5 && // Red dominance
        r > b + 20 && // Red much higher than blue
        r > 70 &&
        r < 240 && // Proper red range
        g > 50 &&
        g < 210 && // Proper green range
        b > 30 &&
        b < 190 && // Proper blue range
        Math.abs(r - g) < 50 && // Red-green similarity
        brightness > 60 &&
        brightness < 210 // Proper brightness

      if (isSkinTone) {
        skinPixels++
        consecutiveSkin++
        if (consecutiveSkin > 5) {
          skinClusters++
          consecutiveSkin = 0
        }
      } else {
        consecutiveSkin = 0
      }

      // Warm vs cool tone analysis
      if (r > g && r > b) warmTonePixels++
      if (b > r + 10 || g > r + 10) coolTonePixels++
    }

    const avgR = redSum / totalSamples
    const avgG = greenSum / totalSamples
    const avgB = blueSum / totalSamples
    const avgBrightness = (avgR + avgG + avgB) / 3

    const skinPercentage = (skinPixels / totalSamples) * 100
    const warmPercentage = (warmTonePixels / totalSamples) * 100
    const coolPercentage = (coolTonePixels / totalSamples) * 100

    console.log(`[v0] === Advanced Skin Detection ===`)
    console.log(`[v0] Average RGB: R${avgR.toFixed(0)} G${avgG.toFixed(0)} B${avgB.toFixed(0)}`)
    console.log(`[v0] Skin pixels: ${skinPercentage.toFixed(1)}%`)
    console.log(`[v0] Warm tones: ${warmPercentage.toFixed(1)}%`)
    console.log(`[v0] Cool tones: ${coolPercentage.toFixed(1)}%`)
    console.log(`[v0] Skin clusters: ${skinClusters}`)
    console.log(`[v0] Avg brightness: ${avgBrightness.toFixed(0)}`)

    // Rule 1: Check for extreme color imbalances (pure blue sky/water, pure green grass)
    if (avgB > avgR + 30 && avgB > avgG + 20) {
      return {
        valid: false,
        confidence: 0,
        reason: `Strong blue dominance detected, possibly sky or water photo.`,
      }
    }

    if (avgG > avgR + 30 && avgG > avgB + 20) {
      return {
        valid: false,
        confidence: 0,
        reason: `Strong green dominance detected, possibly plants or grass photo.`,
      }
    }

    // Rule 2: Check for solid colors or graphics
    const colorVariance = Math.abs(avgR - avgG) + Math.abs(avgG - avgB) + Math.abs(avgR - avgB)
    if (colorVariance < 10 && (avgBrightness < 40 || avgBrightness > 220)) {
      return {
        valid: false,
        confidence: 0,
        reason: "Image color is too uniform, possibly a solid color or graphic.",
      }
    }

    // Rule 3: Brightness validation (allow a wide range for real photos)
    if (avgBrightness < 30 || avgBrightness > 240) {
      return {
        valid: false,
        confidence: 0,
        reason: avgBrightness < 30 ? "Image is too dark to analyze" : "Image is too bright or all white",
      }
    }

    // Rule 4: Must have at least some skin-tone pixels (very lenient)
    if (skinPercentage < 2) {
      return {
        valid: false,
        confidence: 0,
        reason: `Almost no skin tones detected. Please upload a clear skin photo.`,
      }
    }

    // Calculate confidence based on skin percentage
    const confidence = Math.min(95, 40 + skinPercentage * 3)

    console.log(`[v0] ✓ Validation PASSED with ${confidence.toFixed(1)}% confidence`)

    return { valid: true, confidence }
  } catch (error) {
    console.error("[v0] Skin detection error:", error)
    return { valid: false, confidence: 0, reason: "Image processing failed" }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("[v0] Starting advanced skin detection validation...")

    const result = await detectSkin(image)

    if (!result.valid) {
      console.log("[v0] Validation failed:", result.reason)
      return NextResponse.json(
        {
          valid: false,
          error: result.reason || "No skin detected. Please upload a clear skin photo (face, hand, arm, etc.).",
          confidence: result.confidence,
        },
        { status: 400 },
      )
    }

    console.log("[v0] Skin validation successful")
    return NextResponse.json({ valid: true, confidence: result.confidence })
  } catch (error) {
    console.error("[v0] Skin validation error:", error)
    return NextResponse.json({ error: "Image validation failed" }, { status: 500 })
  }
}
