import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid.jsx'
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getProducts } from '../services/productService.js'
import { fakeFetch } from '../utils/fakeFetch.js'
import { matchesSearchQuery, matchesCategory } from '../utils/search.js'

const CATEGORIES = [
  { key: 'all', label: 'All Products' },
  { key: 'new', label: 'New In' },
  { key: 'tees', label: 'Tees' },
  { key: 'shirts', label: 'Shirts' },
  { key: 'outerwear', label: 'Outerwear' },
  { key: 'bottoms', label: 'Bottoms' },
]
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const PRICE_OPTIONS = [
  { key: 'under2000', label: 'Under BDT 2,000' },
  { key: '2000-3000', label: 'BDT 2,000 – 3,000' },
  { key: 'over3000', label: 'Over BDT 3,000' },
]


function matchesSize(p, selectedSizes) {
  if (!selectedSizes.size) return true
  return [...selectedSizes].some(s => p.sizes.includes(s) && !p.oos.includes(s))
}
function matchesPrice(p, selectedPrices) {
  if (!selectedPrices.size) return true
  return [...selectedPrices].some(key => {
    if (key === 'under2000') return p.price < 2000
    if (key === '2000-3000') return p.price >= 2000 && p.price <= 3000
    if (key === 'over3000') return p.price > 3000
    return false
  })
}

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const cat = searchParams.get('cat') || 'all'
  const sort = searchParams.get('sort') || 'featured'
  const searchQuery = searchParams.get('search') || ''
  const selectedSizes = new Set((searchParams.get('sizes') || '').split(',').filter(Boolean))
  const selectedPrices = new Set((searchParams.get('price') || '').split(',').filter(Boolean))

  // Simulates a network fetch, same as the original renderShop()'s
  // load() function calling fakeFetch(). reloadKey lets the "Try Again"
  // button re-run this effect.
  useEffect(() => {
    setLoading(true)
    setLoadError(false)
    fakeFetch(true, { delay: 280 })
      .then(() => setLoading(false))
      .catch(() => { setLoading(false); setLoadError(true) })
  }, [reloadKey])

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setSearchParams(next, { replace: true })
  }

  function setCat(nextCat) {
    updateParams({ cat: nextCat === 'all' ? '' : nextCat })
  }
  function toggleSize(size) {
    const next = new Set(selectedSizes)
    next.has(size) ? next.delete(size) : next.add(size)
    updateParams({ sizes: [...next].join(',') })
  }
  function togglePrice(key) {
    const next = new Set(selectedPrices)
    next.has(key) ? next.delete(key) : next.add(key)
    updateParams({ price: [...next].join(',') })
  }
  function setSort(nextSort) {
    updateParams({ sort: nextSort === 'featured' ? '' : nextSort })
  }
  function clearAllFilters() {
    setSearchParams({}, { replace: true })
  }

  const allProducts = getProducts()
  let filteredList = allProducts.filter(p =>
    matchesCategory(p, cat) &&
    matchesSize(p, selectedSizes) &&
    matchesPrice(p, selectedPrices) &&
    matchesSearchQuery(p, searchQuery)
  )
  // Derived, read-only counts per category (ignores other active filters,
  // mirroring how the category list itself works) — display only.
  const categoryCounts = CATEGORIES.map(c => ({
    ...c,
    count: allProducts.filter(p => matchesCategory(p, c.key)).length,
  }))
  if (sort === 'price-asc') {
    filteredList = [...filteredList].sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    filteredList = [...filteredList].sort((a, b) => b.price - a.price)
  } else if (sort === 'newest') {
    filteredList = filteredList
      .map(p => ({ p, i: allProducts.indexOf(p) }))
      .sort((a, b) => {
        const an = a.p.badge === 'new' ? 0 : 1
        const bn = b.p.badge === 'new' ? 0 : 1
        if (an !== bn) return an - bn
        return b.i - a.i
      })
      .map(x => x.p)
  }

  const activeChips = []
  if (cat !== 'all') {
    const c = CATEGORIES.find(c => c.key === cat)
    activeChips.push({ label: c ? c.label : cat, onRemove: () => setCat('all') })
  }
  selectedSizes.forEach(s => {
    activeChips.push({ label: `Size ${s}`, onRemove: () => toggleSize(s) })
  })
  selectedPrices.forEach(k => {
    const opt = PRICE_OPTIONS.find(o => o.key === k)
    activeChips.push({ label: opt ? opt.label : k, onRemove: () => togglePrice(k) })
  })
  if (searchQuery.trim()) {
    activeChips.push({ label: `“${searchQuery.trim()}”`, onRemove: () => updateParams({ search: '' }) })
  }

  return (
    <div className="wrap">
      <div className="page-strip">
        <h1 id="shopHeading">Shop</h1>
        <span className="count" aria-live="polite">
          {loading ? 'Loading…' : !loadError ? `${filteredList.length} item${filteredList.length !== 1 ? 's' : ''}` : ''}
        </span>
      </div>

      <div className="shop-layout">
        <aside className={`filters${isFiltersOpen ? ' open' : ''}`} aria-label="Filter products">
          <button type="button" className="filters-close" aria-label="Close filters" onClick={() => setIsFiltersOpen(false)}>&times;</button>

          <div className="filter-group">
            <h4 id="catLabel">Category</h4>
            <div role="group" aria-labelledby="catLabel">
              {categoryCounts.map(c => (
                <button
                  key={c.key}
                  type="button"
                  className="filter-opt"
                  aria-pressed={cat === c.key}
                  onClick={() => setCat(c.key)}
                >
                  <span>{c.label}</span>
                  <span className="n" aria-hidden="true">{c.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 id="sizeLabel">Size</h4>
            <div role="group" aria-labelledby="sizeLabel">
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className="filter-opt"
                  aria-pressed={selectedSizes.has(s)}
                  onClick={() => toggleSize(s)}
                >
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4 id="priceLabel">Price</h4>
            <div role="group" aria-labelledby="priceLabel">
              {PRICE_OPTIONS.map(o => (
                <button
                  key={o.key}
                  type="button"
                  className="filter-opt"
                  aria-pressed={selectedPrices.has(o.key)}
                  onClick={() => togglePrice(o.key)}
                >
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="clear-filters" onClick={clearAllFilters}>Clear All Filters</button>
        </aside>

        <div>
          <div className="shop-toolbar">
            <button className="btn ghost filters-toggle" onClick={() => setIsFiltersOpen(true)}>Filter</button>
            <label className="visually-hidden" htmlFor="sortSelect">Sort products</label>
            <select
              className="sort-select"
              id="sortSelect"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="featured">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {activeChips.length > 0 && (
            <div className="active-filters">
              {activeChips.map((chip, i) => (
                <span className="active-filter-chip" key={i}>
                  {chip.label}
                  <button type="button" aria-label={`Remove ${chip.label} filter`} onClick={chip.onRemove}>&times;</button>
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : loadError ? (
            <div className="p-grid">
              <EmptyState
                isError
                title="Something went wrong"
                body="We could not load products. Please try again."
                onRetry={() => setReloadKey(k => k + 1)}
              />
            </div>
          ) : (
            <ProductGrid
              products={filteredList}
              emptyTitle="No products match"
              emptyBody="Try a different category, size, price range or search term."
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop