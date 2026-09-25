import { createContext, useContext, useEffect, useState } from 'react'
import { PRODUCTS } from '../data/products.js'
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

  const cartLines = cart
    .map(item => ({ item, product: PRODUCTS.find(p => p.id === item.id) }))
    .filter(l => l.product)

  const itemCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cartLines.reduce((s, l) => s + l.product.price * l.item.qty, 0)

  function addToCart(id, size, qty, color = 0) {
    setCart(prev => {
      const existingIdx = prev.findIndex(i => i.id === id && i.size === size && (i.color ?? 0) === color)
      if (existingIdx !== -1) {
        const next = [...prev]
        next[existingIdx] = { ...next[existingIdx], qty: Math.min(9, next[existingIdx].qty + qty) }
        return next
      }
      return [...prev, { id, size, qty: Math.min(9, qty), color }]
    })
  }

  function incrementItem(idx) {
    setCart(prev => prev.map((i, n) => (n === idx ? { ...i, qty: Math.min(9, i.qty + 1) } : i)))
  }
  function decrementItem(idx) {
    setCart(prev => prev.map((i, n) => (n === idx ? { ...i, qty: Math.max(1, i.qty - 1) } : i)))
  }
  function removeItem(idx) {
    setCart(prev => prev.filter((_, n) => n !== idx))
    announce('Item removed from bag')
  }
  function clearCart() {
    setCart([])
  }

  function openCartDrawer() { setIsDrawerOpen(true) }
  function closeCartDrawer() { setIsDrawerOpen(false) }

  return (
    <CartContext.Provider
      value={{
        cart, cartLines, itemCount, subtotal,
        addToCart, incrementItem, decrementItem, removeItem, clearCart,
        isDrawerOpen, openCartDrawer, closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}