"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  userEmail: string | null
  setIsAuthenticated: (value: boolean) => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userEmail: null,
  setIsAuthenticated: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check login state from cookie
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check")
        if (res.ok) {
          const data = await res.json()
          setIsAuthenticated(data.authenticated)
          setUserEmail(data.email || null)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
