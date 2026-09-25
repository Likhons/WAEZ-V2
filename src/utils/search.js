import { PRODUCTS } from '../data/products.js'

export function matchesSearchQuery(p, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (p.name.toLowerCase().includes(q)) return true
  if (p.cat.toLowerCase().includes(q)) return true
  if (p.shape.toLowerCase().includes(q)) return true
  if (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) return true
  return false
}

export function searchProducts(query) {
  if (!query.trim()) return []
  return PRODUCTS.filter(p => matchesSearchQuery(p, query))
}