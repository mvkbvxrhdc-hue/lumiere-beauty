"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface FootprintItem {
  id: string
  type: "post" | "course" | "product"
  title: string
  image?: string
  viewedAt: string
}

interface User {
  id: string
  name: string
  avatar: string
  role: string
}

interface UserActivityContextType {
  // Favorites
  favoriteCourses: Set<string>
  favoriteProducts: Set<string>
  toggleFavoriteCourse: (courseId: string) => void
  toggleFavoriteProduct: (productId: string) => void

  // Following/Followers
  following: User[]
  followers: User[]
  toggleFollow: (user: User) => void
  isFollowing: (userId: string) => boolean

  // Footprints (browsing history)
  footprints: FootprintItem[]
  addFootprint: (item: Omit<FootprintItem, "viewedAt">) => void
  clearFootprints: () => void
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined)

export function UserActivityProvider({ children }: { children: React.ReactNode }) {
  const [favoriteCourses, setFavoriteCourses] = useState<Set<string>>(new Set())
  const [favoriteProducts, setFavoriteProducts] = useState<Set<string>>(new Set())
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [footprints, setFootprints] = useState<FootprintItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("userActivity")
      if (savedData) {
        const data = JSON.parse(savedData)
        if (data.favoriteCourses) setFavoriteCourses(new Set(data.favoriteCourses))
        if (data.favoriteProducts) setFavoriteProducts(new Set(data.favoriteProducts))
        if (data.following) setFollowing(data.following)
        if (data.followers) setFollowers(data.followers)
        if (data.footprints) setFootprints(data.footprints)
      }
    } catch (error) {
      console.error("Failed to load user activity data:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(
          "userActivity",
          JSON.stringify({
            favoriteCourses: Array.from(favoriteCourses),
            favoriteProducts: Array.from(favoriteProducts),
            following,
            followers,
            footprints,
          }),
        )
      } catch (error) {
        console.error("Failed to save user activity data:", error)
      }
    }
  }, [favoriteCourses, favoriteProducts, following, followers, footprints, isLoaded])

  const toggleFavoriteCourse = (courseId: string) => {
    setFavoriteCourses((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(courseId)) {
        newSet.delete(courseId)
      } else {
        newSet.add(courseId)
      }
      return newSet
    })
  }

  const toggleFavoriteProduct = (productId: string) => {
    setFavoriteProducts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const toggleFollow = (user: User) => {
    setFollowing((prev) => {
      const isCurrentlyFollowing = prev.some((u) => u.id === user.id)
      if (isCurrentlyFollowing) {
        return prev.filter((u) => u.id !== user.id)
      } else {
        return [...prev, user]
      }
    })
  }

  const isFollowing = (userId: string) => {
    return following.some((u) => u.id === userId)
  }

  const addFootprint = (item: Omit<FootprintItem, "viewedAt">) => {
    setFootprints((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter((f) => !(f.id === item.id && f.type === item.type))
      // Add new item at the beginning
      const newFootprints = [
        {
          ...item,
          viewedAt: new Date().toISOString(),
        },
        ...filtered,
      ]
      // Keep only last 50 items
      return newFootprints.slice(0, 50)
    })
  }

  const clearFootprints = () => {
    setFootprints([])
  }

  return (
    <UserActivityContext.Provider
      value={{
        favoriteCourses,
        favoriteProducts,
        toggleFavoriteCourse,
        toggleFavoriteProduct,
        following,
        followers,
        toggleFollow,
        isFollowing,
        footprints,
        addFootprint,
        clearFootprints,
      }}
    >
      {children}
    </UserActivityContext.Provider>
  )
}

export function useUserActivity() {
  const context = useContext(UserActivityContext)
  if (context === undefined) {
    throw new Error("useUserActivity must be used within a UserActivityProvider")
  }
  return context
}
