import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { announce } from '../utils/announce.js'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'waez-wishlist'

function loadInitialWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadInitialWishlist)

  // Persist to localStorage any time the wishlist changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...wishlist]))
    } catch {
      // Ignore write failures (e.g. private browsing storage limits)
    }
  }, [wishlist])

  const isWished = useCallback(id => wishlist.has(id), [wishlist])

  const toggleWishlist = useCallback((id, name) => {
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        announce(`${name || 'Item'} removed from wishlist`)
      } else {
        next.add(id)
        announce(`${name || 'Item'} added to wishlist`)
      }
      return next
    })
  }, [])

  const value = useMemo(() => ({ wishlist, isWished, toggleWishlist }), [wishlist, isWished, toggleWishlist])

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider')
  return ctx
}