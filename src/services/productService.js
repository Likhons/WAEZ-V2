// Product/catalog data layer.
//
// Everything in this file reads from the local PRODUCTS array for now.
// When a real backend exists, only this file needs to change (e.g. each
// function becomes an async call to a Node/MySQL API) — nothing that
// imports from here should need to change, since the function shapes
// below are written to match what that API would return.
import { PRODUCTS, BADGES } from '../data/products.js'
import { matchesSearchQuery } from '../utils/search.js'

export function getProducts() {
  return PRODUCTS
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id)
}

export function getProductsByCategory(category) {
  if (!category || category === 'all') return PRODUCTS
  return PRODUCTS.filter(p => p.cat === category)
}

export function searchProducts(query) {
  if (!query || !query.trim()) return []
  return PRODUCTS.filter(p => matchesSearchQuery(p, query))
}

export function getBadge(key) {
  return BADGES[key]
}