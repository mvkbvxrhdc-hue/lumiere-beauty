import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/content/${kind}`, {
      cache: "no-store",
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      return NextResponse.json(data ?? { error: "Could not load content" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[content] backend request failed", error)
    return NextResponse.json({ error: "Could not connect to backend" }, { status: 502 })
  }
}
