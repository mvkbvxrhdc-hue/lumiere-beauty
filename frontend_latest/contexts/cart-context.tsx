"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/products-data"
import type { BeautyService } from "@/lib/beauty-services-data"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: "product" | "service"
  // Product-specific fields
  category?: string
  brand?: string
  // Service-specific fields
  duration?: string
  partnerClinic?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: Product | BeautyService, type: "product" | "service") => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("cart", JSON.stringify(items))
      } catch (error) {
        console.error("Failed to save cart:", error)
      }
    }
  }, [items, isLoaded])

  const addToCart = (item: Product | BeautyService, type: "product" | "service") => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id && cartItem.type === type)

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id && cartItem.type === type
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        )
      }

      // Create cart item based on type
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        type,
      }

      // Add type-specific fields
      if (type === "product") {
        const product = item as Product
        newCartItem.category = product.category
        newCartItem.brand = product.brand
      } else {
        const service = item as BeautyService
        newCartItem.duration = service.duration
        newCartItem.partnerClinic = service.partnerClinic
      }

      return [...currentItems, newCartItem]
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setItems((currentItems) => currentItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
