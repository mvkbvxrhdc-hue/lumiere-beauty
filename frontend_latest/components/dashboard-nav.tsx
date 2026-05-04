"use client"

import {
  Home,
  BookOpen,
  ShoppingBag,
  Users,
  Scan,
  MessageSquare,
  User,
  ShoppingCart,
  Sparkles,
  Mail,
  CalendarDays,
  Ticket,
  Menu,
  LogOut,
  FlaskConical,
  CalendarCheck,
  BookHeart,
  Award,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"

const groups = [
  {
    label: "Overview",
    items: [
      { name: "Home", href: "/dashboard", icon: Home },
      { name: "Skin Analysis", href: "/dashboard/skin-analysis", icon: Scan },
      { name: "AI Advisor", href: "/dashboard/ai-consultation", icon: MessageSquare },
    ],
  },
  {
    label: "My Journey",
    items: [
      { name: "Skin Calendar", href: "/dashboard/skin-calendar", icon: CalendarCheck },
      { name: "Ingredient Lab", href: "/dashboard/ingredient-lab", icon: FlaskConical },
      { name: "Skin Journal", href: "/dashboard/skin-journal", icon: BookHeart },
      { name: "Rewards", href: "/dashboard/rewards", icon: Award },
    ],
  },
  {
    label: "Services",
    items: [
      { name: "Beauty Services", href: "/dashboard/beauty-services", icon: Sparkles },
      { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
      { name: "Courses", href: "/dashboard/courses", icon: BookOpen },
    ],
  },
  {
    label: "Shop",
    items: [
      { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
      { name: "Coupons", href: "/dashboard/coupons", icon: Ticket },
    ],
  },
  {
    label: "Community",
    items: [
      { name: "Community", href: "/dashboard/community", icon: Users },
      { name: "Messages", href: "/dashboard/messages", icon: Mail },
      { name: "Profile", href: "/dashboard/profile", icon: User },
    ],
  },
]

function NavItem({
  item,
  isActive,
}: {
  item: { name: string; href: string; icon: React.ElementType }
  isActive: boolean
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-white/10 text-white"
          : "text-white/50 hover:bg-white/7 hover:text-white/80"
      )}
    >
      <item.icon
        className={cn(
          "w-4 h-4 flex-shrink-0 transition-colors",
          isActive ? "text-violet-300" : "text-white/30 group-hover:text-white/60"
        )}
      />
      <span className="truncate">{item.name}</span>
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
      )}
    </Link>
  )
}

import type React from "react"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href + "/") && href !== "/dashboard")

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        toast.success("Logged out successfully")
        router.push("/login")
        router.refresh()
      } else {
        toast.error("Failed to log out")
      }
    } catch {
      toast.error("An error occurred while logging out")
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1a1025]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-900/40">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-white tracking-tight">Lumière</span>
          <span className="block text-[10px] text-white/30 -mt-0.5 tracking-widest uppercase">Beauty</span>
        </div>
      </div>

      {/* Nav groups */}
      <ScrollArea className="flex-1 py-5">
        <div className="px-3 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/20">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.name} item={item} isActive={isActive(item.href)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom */}
      <div className="flex-shrink-0 border-t border-white/5 p-3 space-y-0.5">
        <Link
          href="/dashboard/cart"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            isActive("/dashboard/cart")
              ? "bg-white/10 text-white"
              : "text-white/40 hover:bg-white/7 hover:text-white/70"
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          Cart
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-[#1a1025] border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 p-0 border-0">
              {sidebarContent}
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 ml-1">
            <div className="w-6 h-6 rounded-lg bg-violet-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white text-sm">Lumière</span>
          </div>
        </div>
        <Link href="/dashboard/cart">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Mobile spacer */}
      <div className="md:hidden h-14" />
    </>
  )
}
