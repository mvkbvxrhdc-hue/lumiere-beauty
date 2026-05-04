"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useCart } from "@/contexts/cart-context"
import { useCommunity } from "@/contexts/community-context"
import { useCourses } from "@/contexts/courses-context"
import { useUserActivity } from "@/contexts/user-activity-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  BookOpen,
  Users,
  UserPlus,
  Camera,
  Edit2,
  Syringe,
  Zap,
  Scissors,
  Clock,
  DollarSign,
  FileText,
  ArrowRight,
  CheckCircle2,
  CalendarClock,
  Package,
  Truck,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { products } from "@/lib/products-data"
import { courses } from "@/lib/courses-data"
import { treatmentHistory, type TreatmentRecord } from "@/lib/treatment-history-data"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const cartContext = useCart()
  const communityContext = useCommunity()
  const coursesContext = useCourses()
  const userActivity = useUserActivity()
  const router = useRouter()

  const cartItems = cartContext?.items || []
  const posts = communityContext?.posts || []
  const savedPosts = communityContext?.savedPosts || new Set()
  const enrolledCourses = coursesContext?.enrolledCourses || []
  const completedLessons = coursesContext?.completedLessons || new Set()

  const following = userActivity?.following || []
  const followers = userActivity?.followers || []
  const recentlyViewed = userActivity?.recentlyViewed || []
  const favoriteCourses = userActivity?.favoriteCourses || new Set()
  const favoriteProducts = userActivity?.favoriteProducts || new Set()

  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    location: "San Francisco, CA",
    joinedDate: "January 2024",
    bio: "Skincare enthusiast and beauty blogger",
  })

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: true,
    darkMode: false,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentRecord | null>(null)

  const [avatarUrl, setAvatarUrl] = useState("/default-avatar.jpg")
  const [backgroundUrl, setBackgroundUrl] = useState("/default-profile-background.jpg")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isUploadingBackground, setIsUploadingBackground] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  const [orderHistory] = useState([
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 156.97,
      items: [
        {
          id: 1,
          name: "Hyaluronic Acid Serum",
          type: "product",
          quantity: 2,
          price: 49.99,
          image: "/products/hyaluronic-acid-serum.jpg",
        },
        {
          id: 2,
          name: "Vitamin C Brightening Cream",
          type: "product",
          quantity: 1,
          price: 56.99,
          image: "/products/vitamin-c-cream.jpg",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: "delivered",
      total: 299.0,
      items: [
        {
          id: 3,
          name: "Botox Treatment - Forehead Lines",
          type: "service",
          quantity: 1,
          price: 299.0,
          image: "/services/botox-treatment.jpg",
          appointmentDate: "2024-02-05",
          clinic: "Beauty Wellness Center",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-25",
      status: "processing",
      total: 89.98,
      items: [
        {
          id: 4,
          name: "Retinol Night Cream",
          type: "product",
          quantity: 1,
          price: 44.99,
          image: "/products/retinol-cream.jpg",
        },
        {
          id: 5,
          name: "Niacinamide Serum",
          type: "product",
          quantity: 1,
          price: 44.99,
          image: "/products/niacinamide-serum.jpg",
        },
      ],
    },
    {
      id: "ORD-004",
      date: "2024-02-01",
      status: "pending",
      total: 450.0,
      items: [
        {
          id: 6,
          name: "Laser Skin Resurfacing",
          type: "service",
          quantity: 1,
          price: 450.0,
          image: "/services/laser-treatment.jpg",
          appointmentDate: "2024-02-15",
          clinic: "Advanced Dermatology Clinic",
        },
      ],
    },
  ])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setAvatarUrl(data.url)
      toast.success("Avatar updated successfully!")
    } catch (error) {
      console.error("Avatar upload error:", error)
      toast.error("Failed to upload avatar")
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleBackgroundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB")
      return
    }

    setIsUploadingBackground(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setBackgroundUrl(data.url)
      toast.success("Background updated successfully!")
    } catch (error) {
      console.error("Background upload error:", error)
      toast.error("Failed to upload background")
    } finally {
      setIsUploadingBackground(false)
    }
  }

  const userPosts = Array.isArray(posts) ? posts.filter((p) => p?.author?.name === "You") : []
  const savedPostsList =
    Array.isArray(posts) && savedPosts instanceof Set ? posts.filter((p) => p?.id && savedPosts.has(p.id)) : []
  const favoriteCoursesList = Array.isArray(courses) ? courses.filter((c) => c?.id && favoriteCourses.has(c.id)) : []
  const favoriteProductsList = Array.isArray(products)
    ? products.filter((p) => p?.id && favoriteProducts.has(p.id))
    : []

  const totalLessons = Array.isArray(enrolledCourses)
    ? enrolledCourses.reduce((sum, course) => {
        const lessons = course?.lessons
        return sum + (Array.isArray(lessons) ? lessons.length : 0)
      }, 0)
    : 0
  const completionRate =
    totalLessons > 0 && completedLessons instanceof Set ? (completedLessons.size / totalLessons) * 100 : 0

  const handleSaveProfile = () => {
    setIsEditing(false)
    toast.success("Profile updated successfully!")
  }

  const handleSaveSettings = () => {
    toast.success("Settings saved!")
  }

  const getTreatmentIcon = (type: TreatmentRecord["type"]) => {
    switch (type) {
      case "injection":
        return <Syringe className="h-5 w-5" />
      case "laser":
        return <Zap className="h-5 w-5" />
      case "surgery":
        return <Scissors className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTreatmentColor = (type: TreatmentRecord["type"]) => {
    switch (type) {
      case "injection":
        return "from-purple-400 to-purple-500"
      case "laser":
        return "from-pink-400 to-pink-500"
      case "surgery":
        return "from-purple-500 to-pink-500"
      default:
        return "from-purple-300 to-pink-300"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return { className: "bg-green-100 text-green-700", label: "Delivered" }
      case "processing":
        return { className: "bg-blue-100 text-blue-700", label: "Processing" }
      case "pending":
        return { className: "bg-yellow-100 text-yellow-700", label: "Pending" }
      case "cancelled":
        return { className: "bg-red-100 text-red-700", label: "Cancelled" }
      default:
        return { className: "bg-gray-100 text-gray-700", label: status }
    }
  }

  const handleLogout = () => {
    toast.success("Logged out successfully!")
    // Clear any stored auth data if needed
    localStorage.removeItem("authToken")
    // Redirect to login page
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="relative h-64 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-300 overflow-hidden">
        {backgroundUrl && (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${backgroundUrl}')` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 right-6">
          <input
            ref={backgroundInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBackgroundUpload}
          />
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => backgroundInputRef.current?.click()}
            disabled={isUploadingBackground}
          >
            <Camera className="h-4 w-4" />
            {isUploadingBackground ? "Uploading..." : "Change Cover"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 pb-12">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg ring-4 ring-purple-100">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile picture" />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    {profile.name[0]}
                  </AvatarFallback>
                </Avatar>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md hover:scale-110 transition-transform"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  {isUploadingAvatar ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex-1 space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-purple-400 to-pink-400">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {profile.name}
                        </h2>
                        <p className="text-muted-foreground mt-1">{profile.bio}</p>
                      </div>
                      <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50">
                        <Mail className="h-4 w-4 text-purple-500" />
                        {profile.email}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50">
                        <MapPin className="h-4 w-4 text-pink-500" />
                        {profile.location}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        Joined {profile.joinedDate}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-4 mt-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-300 to-purple-400 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Posts</CardTitle>
              <MessageCircle className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{userPosts.length}</div>
              <p className="text-xs text-white/70 mt-1">Community contributions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-300 to-pink-400 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-white/70 mt-1">Learning progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-400 to-purple-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Following</CardTitle>
              <UserPlus className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{following.length}</div>
              <p className="text-xs text-white/70 mt-1">People you follow</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-400 to-pink-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">Followers</CardTitle>
              <Users className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold">{followers.length}</div>
              <p className="text-xs text-white/70 mt-1">Your community</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="activity" className="space-y-6 mt-6">
          <TabsList className="w-full bg-white shadow-md p-2 h-auto flex flex-wrap gap-2 justify-start">
            <TabsTrigger
              value="activity"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="treatments"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Treatments
            </TabsTrigger>
            <TabsTrigger
              value="favorites"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Favorites
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Following
            </TabsTrigger>
            <TabsTrigger
              value="followers"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Followers
            </TabsTrigger>
            <TabsTrigger
              value="footprints"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Footprints
            </TabsTrigger>
            <TabsTrigger
              value="courses"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              My Courses
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="flex-1 min-w-[120px] py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white rounded-lg transition-all"
            >
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>My Posts</CardTitle>
                <CardDescription>Your community contributions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex items-start justify-between p-4 rounded-lg border hover:border-slate-300 hover:shadow-md transition-all"
                      >
                        <div>
                          <Link
                            href={`/dashboard/community/${post.id}`}
                            className="font-semibold hover:text-purple-600"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">{post.createdAt}</p>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-400 to-pink-400">{post.category}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No posts yet. Share your skincare journey!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Treatment History</CardTitle>
                    <CardDescription>Track your medical aesthetic procedures and results</CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-400 to-pink-400">
                    <FileText className="h-4 w-4 mr-2" />
                    Add Treatment
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Treatment Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-400 text-white">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{treatmentHistory.length}</p>
                        <p className="text-sm text-muted-foreground">Total Treatments</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-pink-400 text-white">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pink-600">
                          ${treatmentHistory.reduce((sum, t) => sum + t.cost, 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Investment</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                        <CalendarClock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {treatmentHistory.filter((t) => t.nextAppointment).length}
                        </p>
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Treatment Timeline */}
                <div className="space-y-4">
                  {treatmentHistory.map((treatment, index) => (
                    <div
                      key={treatment.id}
                      className="relative pl-8 pb-8 border-l-2 border-purple-200 last:border-l-0 last:pb-0"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 -ml-[9px] w-4 h-4 rounded-full bg-gradient-to-r ${getTreatmentColor(treatment.type)} border-2 border-white shadow-md`}
                      />

                      {/* Treatment Card */}
                      <Card className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div
                                className={`p-3 rounded-lg bg-gradient-to-r ${getTreatmentColor(treatment.type)} text-white`}
                              >
                                {getTreatmentIcon(treatment.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{treatment.name}</h3>
                                  <Badge
                                    variant={treatment.status === "completed" ? "secondary" : "default"}
                                    className={
                                      treatment.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }
                                  >
                                    {treatment.status === "completed" ? (
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                    ) : (
                                      <Clock className="h-3 w-3 mr-1" />
                                    )}
                                    {treatment.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{treatment.description}</p>
                                <div className="flex flex-wrap gap-3 text-sm">
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(treatment.date).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {treatment.area}
                                  </div>
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />${treatment.cost}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTreatment(treatment)}
                                  className="gap-2"
                                >
                                  View Details
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl">{treatment.name}</DialogTitle>
                                  <DialogDescription>{treatment.description}</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6 mt-4">
                                  {/* Doctor Info */}
                                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                                    <Avatar className="h-16 w-16 border-2 border-purple-200">
                                      <AvatarImage src={treatment.doctor.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                                        {treatment.doctor.name[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-semibold text-lg">{treatment.doctor.name}</p>
                                      <p className="text-sm text-muted-foreground">{treatment.doctor.specialty}</p>
                                      <p className="text-sm text-muted-foreground">{treatment.doctor.clinic}</p>
                                    </div>
                                  </div>

                                  {/* Treatment Details */}
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <div className="p-4 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Treatment Date</p>
                                      <p className="font-semibold">
                                        {new Date(treatment.date).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    <div className="p-4 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Treatment Area</p>
                                      <p className="font-semibold">{treatment.area}</p>
                                    </div>
                                    <div className="p-4 rounded-lg border">
                                      <p className="text-sm text-muted-foreground mb-1">Cost</p>
                                      <p className="font-semibold text-lg">${treatment.cost}</p>
                                    </div>
                                    {treatment.nextAppointment && (
                                      <div className="p-4 rounded-lg border bg-blue-50">
                                        <p className="text-sm text-muted-foreground mb-1">Next Appointment</p>
                                        <p className="font-semibold text-blue-600">
                                          {new Date(treatment.nextAppointment).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Notes */}
                                  {treatment.notes && (
                                    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                                      <p className="text-sm font-semibold text-purple-900 mb-2">Treatment Notes</p>
                                      <p className="text-sm text-muted-foreground">{treatment.notes}</p>
                                    </div>
                                  )}

                                  {/* Before/After Photos */}
                                  {treatment.beforePhoto && treatment.afterPhoto && (
                                    <div>
                                      <h3 className="font-semibold text-lg mb-4">Before & After Comparison</h3>
                                      <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-muted-foreground">Before</p>
                                          <img
                                            src={treatment.beforePhoto || "/placeholder.svg"}
                                            alt="Before treatment"
                                            className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium text-muted-foreground">After</p>
                                          <img
                                            src={treatment.afterPhoto || "/placeholder.svg"}
                                            alt="After treatment"
                                            className="w-full h-64 object-cover rounded-lg border-2 border-purple-200"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>

                          {/* Quick Preview of Before/After */}
                          {treatment.beforePhoto && treatment.afterPhoto && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <div className="relative group">
                                <img
                                  src={treatment.beforePhoto || "/placeholder.svg"}
                                  alt="Before"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-white text-sm font-medium">Before</span>
                                </div>
                              </div>
                              <div className="relative group">
                                <img
                                  src={treatment.afterPhoto || "/placeholder.svg"}
                                  alt="After"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-white text-sm font-medium">After</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Doctor Info Preview */}
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t">
                            <Avatar className="h-10 w-10 border-2 border-purple-200">
                              <AvatarImage src={treatment.doctor.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                                {treatment.doctor.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{treatment.doctor.name}</p>
                              <p className="text-xs text-muted-foreground">{treatment.doctor.clinic}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Favorite Items</CardTitle>
                <CardDescription>Products and courses you've saved</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Favorite Products */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Favorite Products ({favoriteProductsList.length})
                    </h3>
                    {favoriteProductsList.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {favoriteProductsList.map((product) => (
                          <Link key={product.id} href={`/dashboard/shop/${product.id}`} className="group block">
                            <Card className="border-0 shadow-md hover:shadow-xl transition-all overflow-hidden">
                              <div className="aspect-square overflow-hidden bg-gray-100">
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-purple-600">${product.price}</span>
                                  <Badge className="bg-gradient-to-r from-purple-400 to-pink-400">
                                    ★ {product.rating}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No favorite products yet. Start exploring our shop!
                      </p>
                    )}
                  </div>

                  {/* Favorite Courses */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Favorite Courses ({favoriteCoursesList.length})
                    </h3>
                    {favoriteCoursesList.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {favoriteCoursesList.map((course) => (
                          <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="group block">
                            <Card className="border-0 shadow-md hover:shadow-xl transition-all">
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                                    <BookOpen className="h-6 w-6" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1 group-hover:text-purple-600 transition-colors">
                                      {course.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">{course.instructor}</p>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-muted-foreground">
                                        {course.lessons?.length || 0} lessons
                                      </span>
                                      <Badge className="bg-gradient-to-r from-purple-400 to-pink-400">
                                        {course.level}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No favorite courses yet. Browse our course library!
                      </p>
                    )}
                  </div>

                  {/* Saved Posts */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Saved Posts ({savedPostsList.length})
                    </h3>
                    {savedPostsList.length > 0 ? (
                      <div className="space-y-3">
                        {savedPostsList.map((post) => (
                          <Link key={post.id} href={`/dashboard/community/${post.id}`} className="block">
                            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-semibold mb-1 hover:text-purple-600 transition-colors">
                                      {post.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      by {post.author?.name} • {post.createdAt}
                                    </p>
                                  </div>
                                  <Badge className="bg-gradient-to-r from-purple-400 to-pink-400">
                                    {post.category}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        No saved posts yet. Save posts from the community!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Following</CardTitle>
                <CardDescription>People you're following in the community</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {following.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {following.map((userId) => {
                      // Mock user data - in real app, fetch from user database
                      const mockUsers = [
                        { id: 1, name: "Dr. Emily Chen", role: "Dermatologist", avatar: "/female-doctor.png" },
                        { id: 2, name: "Sarah Kim", role: "Beauty Blogger", avatar: "/beauty-blogger.jpg" },
                        { id: 3, name: "Dr. Michael Lee", role: "Aesthetic Specialist", avatar: "/male-doctor.png" },
                      ]
                      const user = mockUsers.find((u) => u.id === userId) || mockUsers[0]

                      return (
                        <Card key={userId} className="border-0 shadow-md hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              <Avatar className="h-20 w-20 mb-4 border-2 border-purple-200">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                                  {user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <h4 className="font-semibold mb-1">{user.name}</h4>
                              <p className="text-sm text-muted-foreground mb-4">{user.role}</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                onClick={() => toast.success(`Unfollowed ${user.name}`)}
                              >
                                Following
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Not following anyone yet. Discover people in the community!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Followers</CardTitle>
                <CardDescription>People following you</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {followers.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {followers.map((userId) => {
                      // Mock user data
                      const mockFollowers = [
                        {
                          id: 4,
                          name: "Jessica Wang",
                          role: "Skincare Enthusiast",
                          avatar: "/young-woman-smiling.png",
                        },
                        { id: 5, name: "Amanda Liu", role: "Beauty Lover", avatar: "/asian-woman-skincare.jpg" },
                        { id: 6, name: "Dr. Rachel Park", role: "Dermatologist", avatar: "/female-dermatologist.png" },
                      ]
                      const user = mockFollowers.find((u) => u.id === userId) || mockFollowers[0]

                      return (
                        <Card key={userId} className="border-0 shadow-md hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              <Avatar className="h-20 w-20 mb-4 border-2 border-pink-200">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-xl">
                                  {user.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <h4 className="font-semibold mb-1">{user.name}</h4>
                              <p className="text-sm text-muted-foreground mb-4">{user.role}</p>
                              <Button
                                size="sm"
                                className="w-full bg-gradient-to-r from-purple-400 to-pink-400"
                                onClick={() => toast.success(`Following ${user.name}`)}
                              >
                                Follow Back
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No followers yet. Share your journey to grow your community!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footprints" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Footprints</CardTitle>
                <CardDescription>Your recently viewed items and pages</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {recentlyViewed.length > 0 ? (
                  <div className="space-y-4">
                    {recentlyViewed.map((item) => {
                      // Find the actual item from products or courses
                      const product = products.find((p) => p.id === item.id)
                      const course = courses.find((c) => c.id === item.id)
                      const actualItem = product || course

                      if (!actualItem) return null

                      return (
                        <Link
                          key={item.id}
                          href={product ? `/dashboard/shop/${item.id}` : `/dashboard/courses/${item.id}`}
                          className="block"
                        >
                          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  <img
                                    src={actualItem.image || "/placeholder.svg"}
                                    alt={actualItem.name || actualItem.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1 hover:text-purple-600 transition-colors">
                                    {actualItem.name || actualItem.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {product ? actualItem.category : `Course by ${actualItem.instructor}`}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {item.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      Viewed {new Date(item.viewedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                                {product && (
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-purple-600">${actualItem.price}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No recent activity. Start exploring products and courses!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Track your learning progress</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {completionRate.toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => {
                      const courseLessons = course.lessons || []
                      const completedCount = courseLessons.filter((lesson) => completedLessons.has(lesson.id)).length
                      const progress = courseLessons.length > 0 ? (completedCount / courseLessons.length) * 100 : 0

                      return (
                        <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="block">
                          <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                                  <BookOpen className="h-8 w-8" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg mb-1 hover:text-purple-600 transition-colors">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    by {course.instructor} • {courseLessons.length} lessons
                                  </p>

                                  {/* Progress Bar */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        {completedCount} of {courseLessons.length} lessons completed
                                      </span>
                                      <span className="font-semibold text-purple-600">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all"
                                        style={{ width: `${progress}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 mt-3">
                                    <Badge className="bg-gradient-to-r from-purple-400 to-pink-400">
                                      {course.level}
                                    </Badge>
                                    {progress === 100 && (
                                      <Badge className="bg-green-100 text-green-700">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Completed
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No enrolled courses yet. Browse our course library to start learning!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Notification Settings */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Notifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-5 rounded-lg border hover:border-purple-200 transition-colors">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Button
                          variant={settings.emailNotifications ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings({ ...settings, emailNotifications: !settings.emailNotifications })
                            toast.success(
                              settings.emailNotifications
                                ? "Email notifications disabled"
                                : "Email notifications enabled",
                            )
                          }}
                          className={settings.emailNotifications ? "bg-gradient-to-r from-purple-400 to-pink-400" : ""}
                        >
                          {settings.emailNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-5 rounded-lg border hover:border-purple-200 transition-colors">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive push notifications</p>
                        </div>
                        <Button
                          variant={settings.pushNotifications ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings({ ...settings, pushNotifications: !settings.pushNotifications })
                            toast.success(
                              settings.pushNotifications ? "Push notifications disabled" : "Push notifications enabled",
                            )
                          }}
                          className={settings.pushNotifications ? "bg-gradient-to-r from-purple-400 to-pink-400" : ""}
                        >
                          {settings.pushNotifications ? "Enabled" : "Disabled"}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-5 rounded-lg border hover:border-purple-200 transition-colors">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">Receive promotional content</p>
                        </div>
                        <Button
                          variant={settings.marketingEmails ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings({ ...settings, marketingEmails: !settings.marketingEmails })
                            toast.success(
                              settings.marketingEmails ? "Marketing emails disabled" : "Marketing emails enabled",
                            )
                          }}
                          className={settings.marketingEmails ? "bg-gradient-to-r from-purple-400 to-pink-400" : ""}
                        >
                          {settings.marketingEmails ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Settings */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Appearance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-5 rounded-lg border hover:border-purple-200 transition-colors">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                        </div>
                        <Button
                          variant={settings.darkMode ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSettings({ ...settings, darkMode: !settings.darkMode })
                            toast.success(settings.darkMode ? "Light mode enabled" : "Dark mode enabled")
                          }}
                          className={settings.darkMode ? "bg-gradient-to-r from-purple-400 to-pink-400" : ""}
                        >
                          {settings.darkMode ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
                      Account
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start py-6 text-base bg-transparent hover:bg-purple-50 hover:border-purple-300"
                        onClick={handleSaveSettings}
                      >
                        Save All Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start py-6 text-base text-orange-600 hover:text-orange-700 bg-transparent hover:bg-orange-50 hover:border-orange-300"
                        onClick={() => toast.info("Password change feature coming soon")}
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start py-6 text-base text-purple-600 hover:text-purple-700 bg-transparent hover:bg-purple-50 border-purple-200 hover:border-purple-300"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start py-6 text-base text-red-600 hover:text-red-700 bg-transparent hover:bg-red-50 hover:border-red-300"
                        onClick={() => toast.error("Account deletion requires confirmation")}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>View your past purchases and bookings</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {orderHistory.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Order Stats */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-400 text-white">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {orderHistory.filter((o) => o.status === "delivered").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Delivered</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-400 text-white">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {orderHistory.filter((o) => o.status === "processing").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Processing</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 text-white">
                        <DollarSign className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${orderHistory.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order List */}
                <div className="space-y-4">
                  {orderHistory.map((order) => {
                    const statusBadge = getStatusBadge(order.status)
                    return (
                      <Card key={order.id} className="border-0 shadow-md hover:shadow-lg transition-all">
                        <CardContent className="p-6">
                          {/* Order Header */}
                          <div className="flex items-start justify-between mb-4 pb-4 border-b">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                                <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(order.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-1">Total</p>
                              <p className="text-2xl font-bold text-purple-600">${order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{item.name}</h4>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Badge variant="outline" className="text-xs">
                                      {item.type === "service" ? "Service" : "Product"}
                                    </Badge>
                                    <span>Qty: {item.quantity}</span>
                                    {item.type === "service" && item.appointmentDate && (
                                      <span className="text-purple-600">
                                        Appointment:{" "}
                                        {new Date(item.appointmentDate).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </span>
                                    )}
                                  </div>
                                  {item.type === "service" && item.clinic && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <MapPin className="h-3 w-3 inline mr-1" />
                                      {item.clinic}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-purple-600">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Actions */}
                          <div className="flex gap-2 mt-4 pt-4 border-t">
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => toast.success("Review feature coming soon!")}
                              >
                                Write Review
                              </Button>
                            )}
                            {order.status === "processing" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-transparent"
                                onClick={() => toast.info("Tracking feature coming soon!")}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Track Order
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => toast.success("Reordering items...")}
                            >
                              Reorder
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toast.info("Order details displayed")}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
