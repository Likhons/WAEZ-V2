import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import GarmentSVG from '../components/GarmentSVG.jsx'
import StarRating from '../components/StarRating.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import { getProductById, getBadge, getProductsByCategory } from '../services/productService.js'
import { BDT } from '../utils/currency.js'
import { fakeFetch } from '../utils/fakeFetch.js'
import { useCart } from '../context/CartContext.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'
import { announce } from '../utils/announce.js'

function ProductDetails() {
  const { id } = useParams()
  const p = getProductById(id)

  if (!p) {
    return (
      <div className="wrap">
        <div className="empty-state-page">
          <EmptyState icon="?" title="Product not found" body="This item may have sold out or the link is no longer valid." />
          <Link to="/shop" className="btn" style={{ marginTop: '8px' }}>Back to Shop</Link>
        </div>
      </div>
    )
  }

  return <ProductDetailsContent product={p} />
}

// Split out so hooks only run once we know a real product exists —
// hooks can't safely sit after the early "not found" return above.
function ProductDetailsContent({ product: p }) {
  const firstAvailableSize = p.sizes.find(s => !p.oos.includes(s)) || null

  const [selectedSize, setSelectedSize] = useState(firstAvailableSize)
  const [selectedColor, setSelectedColor] = useState(0)
  const [qty, setQty] = useState(1)
  const [openAccordions, setOpenAccordions] = useState(new Set(['acc-1']))
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [addMsg, setAddMsg] = useState('')
  const { addToCart, openCartDrawer } = useCart()
  const { isWished, toggleWishlist } = useWishlist()
  const wished = isWished(p.id)
  const badge = getBadge(p.badge)

  const related = getProductsByCategory(p.cat).filter(x => x.id !== p.id).slice(0, 4)

  function toggleAccordion(itemId) {
    setOpenAccordions(prev => {
      const next = new Set(prev)
      next.has(itemId) ? next.delete(itemId) : next.add(itemId)
      return next
    })
  }

  function jumpToAccordion(itemId) {
    setOpenAccordions(new Set([itemId]))
    requestAnimationFrame(() => {
      document.getElementById(itemId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

 function handleAddToCart() {
  if (!selectedSize) return

  setIsAdding(true)

  fakeFetch(true, { delay: 400 }).then(() => {
    addToCart(p.id, selectedSize, qty, selectedColor)

    setIsAdding(false)
    setJustAdded(true)

    setAddMsg(`${qty} × ${p.name} (${selectedSize}) added to your bag.`)

    announce(`${p.name} added to bag`)

    setTimeout(() => setJustAdded(false), 1400)

    openCartDrawer()
  })
}

  return (
    <>
      <div className="wrap">
        <div className="pdp">
          <div className="pdp-gallery">
            <div className="shot"><GarmentSVG shape={p.shape} color={p.mark} /></div>
            <div className="shot"><GarmentSVG shape={p.shape} color={p.colors[selectedColor]} /></div>
          </div>
          <div className="pdp-info">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link to="/shop">Shop</Link> / {p.cat} / {p.name}
            </nav>
            {badge && <span className={`pdp-badge ${badge.className}`}>{badge.label}</span>}
            <h1>{p.name}</h1>
            <div className="pdp-price">{BDT(p.price)}</div>

            <StarRating rating={p.rating} reviewCount={p.reviewCount} />

            <div className="pdp-block">
              <h4 id="colorLabel">Color: <span>{p.colorNames[selectedColor]}</span></h4>
              <div className="swatches" role="group" aria-labelledby="colorLabel">
                {p.colors.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    className="swatch"
                    aria-pressed={i === selectedColor}
                    aria-label={p.colorNames[i]}
                    style={{ background: c }}
                    onClick={() => setSelectedColor(i)}
                  ></button>
                ))}
              </div>
            </div>

            <div className="pdp-block">
              <div className="size-head">
                <h4 id="sizeLabel2">Size: <span>{selectedSize || 'Select a size'}</span></h4>
                <button type="button" className="size-guide-link" onClick={() => jumpToAccordion('acc-size-guide')}>
                  Size Guide
                </button>
              </div>
              <div className="size-grid" role="group" aria-labelledby="sizeLabel2">
                {p.sizes.map(s => {
                  const oos = p.oos.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      className="size-opt"
                      aria-pressed={!oos && s === selectedSize}
                      disabled={oos}
                      aria-label={oos ? `${s}, out of stock` : undefined}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              <div className="pdp-note">Runs true to size. See size guide for full measurements.</div>
            </div>

            <div className="qty-add">
              <div className="qty-stepper">
                <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}>&minus;</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" disabled={qty >= 9} onClick={() => setQty(q => Math.min(9, q + 1))}>+</button>
              </div>
              <button
                className={`btn block${isAdding ? ' is-loading' : ''}`}
                style={{ flex: 1 }}
                disabled={!selectedSize || isAdding}
                onClick={handleAddToCart}
              >
                <span className="spinner" aria-hidden="true"></span>
                <span className="btn-label">
                  {!selectedSize ? 'Out Of Stock' : justAdded ? 'Added ✓' : 'Add To Bag'}
                </span>
              </button>
              <button
                type="button"
                className="pdp-wishlist-btn"
                aria-pressed={wished}
                aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
                onClick={() => toggleWishlist(p.id, p.name)}
              >
                <span aria-hidden="true">{wished ? '♥' : '♡'}</span>
              </button>
            </div>
            <p className="pdp-add-msg" role="status" aria-live="polite">{addMsg}</p>

            <div className="accordion" style={{ marginTop: '36px' }}>
              <AccordionItem id="acc-1" title="Product Details" isOpen={openAccordions.has('acc-1')} onToggle={() => toggleAccordion('acc-1')}>
                <p>Heavyweight cotton jersey with a structured drape. Designed in-house for everyday movement, cut with a relaxed, considered fit.</p>
              </AccordionItem>

              <AccordionItem id="acc-2" title="Shipping & Returns" isOpen={openAccordions.has('acc-2')} onToggle={() => toggleAccordion('acc-2')}>
                <p>Dispatched within 2 business days across Bangladesh. Free returns within 14 days of delivery, unworn with tags attached.</p>
              </AccordionItem>

              <AccordionItem id="acc-3" title="Care" isOpen={openAccordions.has('acc-3')} onToggle={() => toggleAccordion('acc-3')}>
                <p>100% combed cotton, 240gsm. Machine wash cold, inside out. Do not tumble dry. Iron on reverse.</p>
              </AccordionItem>

              <div className={`accordion-item${openAccordions.has('acc-size-guide') ? ' open' : ''}`} id="acc-size-guide">
                <button
                  type="button"
                  className="accordion-head"
                  aria-expanded={openAccordions.has('acc-size-guide')}
                  aria-controls="acc-4"
                  onClick={() => toggleAccordion('acc-size-guide')}
                >
                  Size Guide<span className="chev" aria-hidden="true">+</span>
                </button>
                <div className="accordion-body" id="acc-4">
                  <table>
                    <caption>Measurements are in inches.</caption>
                    <thead>
                      <tr>
                        <th scope="col">Size</th>
                        <th scope="col">Chest</th>
                        <th scope="col">Length</th>
                        <th scope="col">Shoulder</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th scope="row">S</th><td>40"</td><td>27"</td><td>17"</td></tr>
                      <tr><th scope="row">M</th><td>42"</td><td>28"</td><td>18"</td></tr>
                      <tr><th scope="row">L</th><td>44"</td><td>29"</td><td>19"</td></tr>
                      <tr><th scope="row">XL</th><td>46"</td><td>30"</td><td>20"</td></tr>
                    </tbody>
                  </table>
                  <p>Between sizes? We recommend sizing up for a more relaxed fit.</p>
                  <Link to="/size-guide" className="size-guide-link">View Full Size Guide</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="wrap related-wrap">
          <section className="related" aria-labelledby="relatedHeading">
            <h2 id="relatedHeading">You May Also Like</h2>
            <ProductGrid products={related} />
          </section>
        </div>
      )}
    </>
  )
}

function AccordionItem({ id, title, isOpen, onToggle, children }) {
  return (
    <div className={`accordion-item${isOpen ? ' open' : ''}`}>
      <button type="button" className="accordion-head" aria-expanded={isOpen} aria-controls={id} onClick={onToggle}>
        {title}<span className="chev" aria-hidden="true">+</span>
      </button>
      <div className="accordion-body" id={id}>{children}</div>
    </div>
  )
}

export default ProductDetails