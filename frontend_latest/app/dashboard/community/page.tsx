"use client"

import { useState } from "react"
import { useCommunity } from "@/contexts/community-context"
import { useUserActivity } from "@/contexts/user-activity-context"
import { categories } from "@/lib/community-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  MessageCircle,
  Eye,
  Search,
  PlusCircle,
  Bookmark,
  UserPlus,
  Video,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react" // Removed ImageIcon
import Link from "next/link"
import { toast } from "sonner"
import { VideoPlayer } from "@/components/video-player"

export default function CommunityPage() {
  const { posts, likedPosts, savedPosts, toggleLikePost, toggleSavePost, addPost } = useCommunity()
  const { toggleFollow, isFollowing } = useUserActivity()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "Routines",
    tags: "",
    videoUrl: "",
  })

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error("Please fill in all required fields")
      return
    }

    addPost({
      author: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Community Member",
      },
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.content.substring(0, 100) + "...",
      category: newPost.category,
      tags: newPost.tags.split(",").map((t) => t.trim()),
      videoUrl: newPost.videoUrl,
    })

    setNewPost({ title: "", content: "", category: "Routines", tags: "", videoUrl: "" })
    setIsCreateDialogOpen(false)
    toast.success("Post created successfully!")
  }

  const handleFollow = (author: { name: string; avatar: string; role: string }) => {
    const user = {
      id: author.name,
      name: author.name,
      avatar: author.avatar,
      role: author.role,
    }
    toggleFollow(user)
    toast.success(isFollowing(user.id) ? "Unfollowed user" : "Following user")
  }

  return (
    <div className="container mx-auto p-6 space-y-6 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -z-10" />

      <div className="relative">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="absolute -top-2 -right-2 w-20 h-20 bg-pink-300/20 rounded-full blur-xl" />
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
                <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-lg" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Community
              </h1>
            </div>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              Connect with beauty enthusiasts worldwide
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newPost.category}
                    onValueChange={(value) => setNewPost({ ...newPost, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((c) => c !== "All")
                        .map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your thoughts..."
                    rows={8}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="skincare, routine, tips"
                  />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL (YouTube or MP4)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="videoUrl"
                      value={newPost.videoUrl}
                      onChange={(e) => setNewPost({ ...newPost, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <Button variant="outline" size="icon" type="button">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Publish Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start overflow-x-auto bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className={`hover:shadow-2xl transition-all duration-300 overflow-hidden group ${
                post.author.isProfessional
                  ? "border-2 border-blue-500/50 shadow-lg shadow-blue-500/10"
                  : "hover:border-purple-200/50"
              }`}
            >
              <CardHeader className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/10 dark:to-pink-950/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar
                      className={`${
                        post.author.isProfessional
                          ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/30"
                          : "ring-2 ring-purple-300/30 group-hover:ring-purple-400/50 transition-all"
                      }`}
                    >
                      <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                        {post.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{post.author.name}</p>
                        {post.author.isProfessional && (
                          <Badge
                            variant="default"
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                          >
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Verified Professional
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {post.author.role} • {post.createdAt}
                      </p>
                    </div>
                    {post.author.name !== "You" && (
                      <Button
                        variant={isFollowing(post.author.name) ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleFollow(post.author)}
                        className={
                          !isFollowing(post.author.name)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                            : ""
                        }
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        {isFollowing(post.author.name) ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  >
                    {post.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/dashboard/community/${post.id}`}>
                  <h2 className="text-2xl font-bold hover:text-transparent hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:bg-clip-text transition-all">
                    {post.title}
                  </h2>
                </Link>
                {post.videoUrl && (
                  <div className="rounded-lg overflow-hidden my-4">
                    <VideoPlayer url={post.videoUrl} title={post.title} />
                  </div>
                )}
                <p className="text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-purple-300/50 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:border-purple-700/50 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-all cursor-pointer"
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between bg-gradient-to-r from-purple-50/30 to-pink-50/30 dark:from-purple-950/10 dark:to-pink-950/10">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLikePost(post.id)}
                    className={`transition-all ${
                      likedPosts.has(post.id) ? "text-red-500 hover:text-red-600" : "hover:text-red-500"
                    }`}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                    {post.likes}
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="hover:text-purple-600">
                    <Link href={`/dashboard/community/${post.id}`}>
                      <MessageCircle className="mr-1 h-4 w-4" />
                      {post.comments}
                    </Link>
                  </Button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {post.views}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toggleSavePost(post.id)
                    toast.success(savedPosts.has(post.id) ? "Post unsaved" : "Post saved")
                  }}
                  className={`transition-all ${
                    savedPosts.has(post.id) ? "text-purple-500 hover:text-purple-600" : "hover:text-purple-500"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  )
}
