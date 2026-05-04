"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { initialPosts, initialComments, type Post, type Comment } from "@/lib/community-data"

interface CommunityContextType {
  posts: Post[]
  comments: Comment[]
  likedPosts: Set<string>
  likedComments: Set<string>
  savedPosts: Set<string>
  followedUsers: Set<string>
  toggleLikePost: (postId: string) => void
  toggleLikeComment: (commentId: string) => void
  toggleSavePost: (postId: string) => void
  toggleFollowUser: (userName: string) => void
  addPost: (post: Omit<Post, "id" | "likes" | "comments" | "views" | "createdAt" | "videoUrl">) => void
  addComment: (comment: Omit<Comment, "id" | "likes" | "createdAt">) => void
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined)

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("community")
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.posts) setPosts(data.posts)
        if (data.comments) setComments(data.comments)
        if (data.likedPosts) setLikedPosts(new Set(data.likedPosts))
        if (data.likedComments) setLikedComments(new Set(data.likedComments))
        if (data.savedPosts) setSavedPosts(new Set(data.savedPosts))
        if (data.followedUsers) setFollowedUsers(new Set(data.followedUsers))
      }
    } catch (error) {
      console.error("Failed to load community data:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          "community",
          JSON.stringify({
            posts,
            comments,
            likedPosts: Array.from(likedPosts),
            likedComments: Array.from(likedComments),
            savedPosts: Array.from(savedPosts),
            followedUsers: Array.from(followedUsers),
          }),
        )
      } catch (error) {
        console.error("Failed to save community data:", error)
      }
    }
  }, [posts, comments, likedPosts, likedComments, savedPosts, followedUsers, isLoaded])

  const toggleLikePost = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
        setPosts((posts) => posts.map((p) => (p.id === postId ? { ...p, likes: p.likes - 1 } : p)))
      } else {
        newSet.add(postId)
        setPosts((posts) => posts.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p)))
      }
      return newSet
    })
  }

  const toggleLikeComment = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
        setComments((comments) => comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes - 1 } : c)))
      } else {
        newSet.add(commentId)
        setComments((comments) => comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)))
      }
      return newSet
    })
  }

  const toggleSavePost = (postId: string) => {
    setSavedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const toggleFollowUser = (userName: string) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userName)) {
        newSet.delete(userName)
      } else {
        newSet.add(userName)
      }
      return newSet
    })
  }

  const addPost = (post: Omit<Post, "id" | "likes" | "comments" | "views" | "createdAt" | "videoUrl">) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: "Just now",
      videoUrl: "", // Default videoUrl
    }
    setPosts((prev) => [newPost, ...prev])
  }

  const addComment = (comment: Omit<Comment, "id" | "likes" | "createdAt">) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      likes: 0,
      createdAt: "Just now",
    }
    setComments((prev) => [...prev, newComment])
    setPosts((posts) => posts.map((p) => (p.id === comment.postId ? { ...p, comments: p.comments + 1 } : p)))
  }

  return (
    <CommunityContext.Provider
      value={{
        posts,
        comments,
        likedPosts,
        likedComments,
        savedPosts,
        followedUsers,
        toggleLikePost,
        toggleLikeComment,
        toggleSavePost,
        toggleFollowUser,
        addPost,
        addComment,
      }}
    >
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunity() {
  const context = useContext(CommunityContext)
  if (context === undefined) {
    throw new Error("useCommunity must be used within a CommunityProvider")
  }
  return context
}
