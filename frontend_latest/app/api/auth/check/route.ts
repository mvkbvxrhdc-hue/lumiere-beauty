import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const authEmail = cookieStore.get("auth_email")

    if (authEmail?.value) {
      return NextResponse.json({
        authenticated: true,
        email: authEmail.value,
      })
    }

    return NextResponse.json({ authenticated: false })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
