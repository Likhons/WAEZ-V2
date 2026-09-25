import { useState } from 'react'
import { Link } from 'react-router-dom'
import GarmentSVG from './GarmentSVG.jsx'
import { BDT } from '../utils/currency.js'
import { BADGES } from '../data/products.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useQuickView } from '../context/QuickViewContext.jsx'
import { fakeFetch } from '../utils/fakeFetch.js'
import { announce } from '../utils/announce.js'

function ProductCard({ product }) {
  const p = product
  const badge = BADGES[p.badge]
  const isComingSoon = p.badge === 'soon'
  const { isWished, toggleWishlist } = useWishlist()
  const { addToCart, openCartDrawer } = useCart()
  const { openQuickView } = useQuickView()
  const wished = isWished(p.id)
  const altColor = p.colors[1] || p.colors[0]
  const colorLabel = p.colorNames.join(' / ')

  const [isQuickAdding, setIsQuickAdding] = useState(false)
  const [quickAdded, setQuickAdded] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)

  function handleQuickAdd() {
    const size = p.sizes.find(s => !p.oos.includes(s))
    if (!size) return
    setIsQuickAdding(true)
    fakeFetch(true, { delay: 350 }).then(() => {
      addToCart(p.id, size, 1, 0)
      announce(`${p.name} added to bag`)
      setIsQuickAdding(false)
      setQuickAdded(true)
      setTimeout(() => setQuickAdded(false), 1400)
      openCartDrawer()
    })
  }

  function handleNotify() {
    setIsNotifying(true)
    setTimeout(() => setIsNotifying(false), 1800)
  }

  return (
    <div className="p-card" data-product-id={p.id}>
      <div className="p-media-wrap">
        <Link
          className="p-media-link"
          to={`/product/${encodeURIComponent(p.id)}`}
          aria-label={`${p.name}, ${BDT(p.price)}${isComingSoon ? ', coming soon' : ''}`}
        >
          <div className="p-media" style={{ background: p.bg }}>
            <GarmentSVG shape={p.shape} color={p.mark} />
          </div>
          <div className="p-media-hover" style={{ background: p.bg }}>
            <GarmentSVG shape={p.shape} color={altColor} />
          </div>
        </Link>

        {badge && <span className={`p-tag ${badge.className}`}>{badge.label}</span>}

        <button
          type="button"
          className="wishlist-btn"
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          onClick={() => toggleWishlist(p.id, p.name)}
        >
          <span aria-hidden="true">{wished ? '♥' : '♡'}</span>
        </button>

        <div className="card-actions">
          {isComingSoon ? (
            <button type="button" className="card-action-btn" disabled={isNotifying} onClick={handleNotify}>
              {isNotifying ? 'We\u2019ll Notify You' : 'Notify Me'}
            </button>
          ) : (
            <button type="button" className="card-action-btn" disabled={isQuickAdding} onClick={handleQuickAdd}>
              {isQuickAdding ? 'Adding…' : quickAdded ? 'Added ✓' : 'Quick Add'}
            </button>
          )}
          <button
            type="button"
            className="card-action-btn ghost"
            aria-haspopup="dialog"
            onClick={() => openQuickView(p)}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="p-meta">
        <Link className="p-name" to={`/product/${encodeURIComponent(p.id)}`}>{p.name}</Link>
        <div className="p-price">{BDT(p.price)}</div>
        <div
          className="p-colors"
          aria-label={`Available in ${p.colors.length} color${p.colors.length !== 1 ? 's' : ''}: ${colorLabel}`}
        >
          {p.colors.map((c, i) => (
            <span key={i} className="color-dot" style={{ background: c }}></span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCard