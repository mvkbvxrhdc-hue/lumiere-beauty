import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { CoursesProvider } from "@/contexts/courses-context"
import { CartProvider } from "@/contexts/cart-context"
import { CommunityProvider } from "@/contexts/community-context"
import { UserActivityProvider } from "@/contexts/user-activity-context"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Lumière Beauty — AI-Powered Skincare & Wellness",
  description: "Your personal AI beauty advisor for skin analysis, treatments, and curated skincare routines.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-white">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <CartProvider>
          <CommunityProvider>
            <CoursesProvider>
              <UserActivityProvider>
                {children}
                <Toaster position="top-center" />
              </UserActivityProvider>
            </CoursesProvider>
          </CommunityProvider>
        </CartProvider>
      </body>
    </html>
  )
}
