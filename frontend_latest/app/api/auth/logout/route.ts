import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Delete auth cookie
    cookieStore.delete('auth_email')

    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully'
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[API] Logout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to log out' },
      { status: 500 }
    )
  }
}
