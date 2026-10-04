import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const QuickViewContext = createContext(null)

export function QuickViewProvider({ children }) {
  const [product, setProduct] = useState(null)

  const openQuickView = useCallback(p => setProduct(p), [])
  const closeQuickView = useCallback(() => setProduct(null), [])

  const value = useMemo(() => ({ product, openQuickView, closeQuickView }), [product, openQuickView, closeQuickView])

  return (
    <QuickViewContext.Provider value={value}>
      {children}
    </QuickViewContext.Provider>
  )
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext)
  if (!ctx) throw new Error('useQuickView must be used within a QuickViewProvider')
  return ctx
}