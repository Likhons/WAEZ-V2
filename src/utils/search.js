export function matchesSearchQuery(p, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (p.name.toLowerCase().includes(q)) return true
  if (p.cat.toLowerCase().includes(q)) return true
  if (p.shape.toLowerCase().includes(q)) return true
  if (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) return true
  return false
}

export function matchesCategory(p, cat) {
  if (cat === 'all') return true
  if (cat === 'new') return p.badge === 'new'
  if (cat === 'shirts') return p.shape === 'shirt'
  if (cat === 'outerwear') return p.cat === 'outerwear' && p.shape !== 'shirt'
  return p.cat === cat
}