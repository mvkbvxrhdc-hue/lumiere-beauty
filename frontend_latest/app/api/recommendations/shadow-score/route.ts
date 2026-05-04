import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_API_BASE_URL =
  process.env.BACKEND_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cookieStore = await cookies()
    const userId = cookieStore.get("auth_email")?.value || "anonymous-demo-user"
    const response = await fetch(`${BACKEND_API_BASE_URL}/api/v1/recommendations/shadow-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        user_id: body.user_id || userId,
      }),
      cache: "no-store",
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (err) {
    console.error("[recommendations/shadow-score]", err)
    return NextResponse.json({ error: "Shadow recommendation scoring failed" }, { status: 500 })
  }
}
