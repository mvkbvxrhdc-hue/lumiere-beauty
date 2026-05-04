import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#f5f4f8]">
      <DashboardNav />
      <main className="flex-1 md:pl-60 overflow-y-auto">{children}</main>
    </div>
  )
}
