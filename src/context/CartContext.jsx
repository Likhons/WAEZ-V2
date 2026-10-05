import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../services/productService.js'
import { announce } from '../utils/announce.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'waez-cart'

function loadInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadInitialCart)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Ignore write failures (e.g. private browsing storage limits)
    }
  }, [cart])

  const cartLines = useMemo(
    () => cart.map(item => ({ item, product: getProductById(item.id) })).filter(l => l.product),
    [cart]
  )
  const itemCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart])
  const subtotal = useMemo(() => cartLines.reduce((s, l) => s + l.product.price * l.item.qty, 0), [cartLines])

  const addToCart = useCallback((id, size, qty, color = 0) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(i => i.id === id && i.size === size && (i.color ?? 0) === color)
      if (existingIdx !== -1) {
        const next = [...prev]
        next[existingIdx] = { ...next[existingIdx], qty: Math.min(9, next[existingIdx].qty + qty) }
        return next
      }
      return [...prev, { id, size, qty: Math.min(9, qty), color }]
    })
  }, [])

  const incrementItem = useCallback(idx => {
    setCart(prev => prev.map((i, n) => (n === idx ? { ...i, qty: Math.min(9, i.qty + 1) } : i)))
  }, [])
  const decrementItem = useCallback(idx => {
    setCart(prev => prev.map((i, n) => (n === idx ? { ...i, qty: Math.max(1, i.qty - 1) } : i)))
  }, [])
  const removeItem = useCallback(idx => {
    setCart(prev => prev.filter((_, n) => n !== idx))
    announce('Item removed from bag')
  }, [])
  const clearCart = useCallback(() => setCart([]), [])

  const openCartDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeCartDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const value = useMemo(() => ({
    cart, cartLines, itemCount, subtotal,
    addToCart, incrementItem, decrementItem, removeItem, clearCart,
    isDrawerOpen, openCartDrawer, closeCartDrawer,
  }), [cart, cartLines, itemCount, subtotal, isDrawerOpen, addToCart, incrementItem, decrementItem, removeItem, clearCart, openCartDrawer, closeCartDrawer])

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}