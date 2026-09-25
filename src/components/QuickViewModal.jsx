import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GarmentSVG from './GarmentSVG.jsx'
import { BDT } from '../utils/currency.js'
import { fakeFetch } from '../utils/fakeFetch.js'
import { useCart } from '../context/CartContext.jsx'
import { useQuickView } from '../context/QuickViewContext.jsx'
import { announce } from '../utils/announce.js'
import { lockScroll, unlockScroll } from '../utils/scrollLock.js'

function QuickViewModal() {
  const { product: p, closeQuickView } = useQuickView()
  const isOpen = !!p

  // displayProduct keeps the last product visible during the closing
  // fade, since `p` itself goes null the instant closeQuickView() runs.
  const [displayProduct, setDisplayProduct] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)

  useEffect(() => {
    let hideTimeout
    let rafId
    if (isOpen) {
      setDisplayProduct(p)
      lastFocusedRef.current = document.activeElement
      setIsMounted(true)
      lockScroll()
      rafId = requestAnimationFrame(() => {
        setIsAnimating(true)
        closeBtnRef.current?.focus()
      })
    } else {
      setIsAnimating(false)
      unlockScroll()
      if (lastFocusedRef.current) lastFocusedRef.current.focus()
      hideTimeout = setTimeout(() => {
        setIsMounted(false)
        setDisplayProduct(null)
      }, 200)
    }
    return () => {
      clearTimeout(hideTimeout)
      cancelAnimationFrame(rafId)
    }
  }, [isOpen, p])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return
      if (e.key === 'Escape') {
        closeQuickView()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll('a, button, input, select, [tabindex]:not([tabindex="-1"])')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeQuickView])

  if (!isMounted || !displayProduct) return null

  return (
    <>
      <div className={`qv-overlay${isAnimating ? ' open' : ''}`} onClick={closeQuickView}></div>
      <div className={`qv-modal${isAnimating ? ' open' : ''}`} ref={modalRef} role="dialog" aria-modal="true" aria-label="Quick view">
        <div className="qv-body">
          <QuickViewBody key={displayProduct.id} product={displayProduct} closeBtnRef={closeBtnRef} />
        </div>
      </div>
    </>
  )
}

function QuickViewBody({ product: p, closeBtnRef }) {
  const { closeQuickView } = useQuickView()
  const { addToCart, openCartDrawer } = useCart()
  const isComingSoon = p.badge === 'soon'
  const firstAvailableSize = p.sizes.find(s => !p.oos.includes(s)) || null

  const [selectedSize, setSelectedSize] = useState(firstAvailableSize)
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)

  function handleAdd() {
    if (!selectedSize) return
    setIsAdding(true)
    fakeFetch(true, { delay: 350 }).then(() => {
      addToCart(p.id, selectedSize, qty, selectedColorIdx)
      announce(`${p.name} added to bag`)
      setIsAdding(false)
      closeQuickView()
      openCartDrawer()
    })
  }

  return (
    <>
      <button type="button" className="qv-close" aria-label="Close quick view" ref={closeBtnRef} onClick={closeQuickView}>&times;</button>
      <div className="qv-media" style={{ background: p.bg }}>
        <GarmentSVG shape={p.shape} color={p.mark} />
      </div>
      <div className="qv-info">
        <div className="eyebrow">{p.cat}</div>
        <h2 id="qvHeading">{p.name}</h2>
        <div className="pdp-price">{BDT(p.price)}</div>

        {p.colors.length > 1 && (
          <div className="pdp-block" style={{ borderTop: 'none', paddingTop: 0 }}>
            <h4 id="qvColorLabel">Color</h4>
            <div className="swatches" role="group" aria-labelledby="qvColorLabel">
              {p.colors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className="swatch"
                  aria-pressed={i === selectedColorIdx}
                  aria-label={p.colorNames[i]}
                  style={{ background: c }}
                  onClick={() => setSelectedColorIdx(i)}
                ></button>
              ))}
            </div>
          </div>
        )}

        <div className="pdp-block" style={p.colors.length > 1 ? undefined : { borderTop: 'none', paddingTop: 0 }}>
          <h4 id="qvSizeLabel">Size</h4>
          <div className="size-grid" role="group" aria-labelledby="qvSizeLabel">
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
        </div>

        {isComingSoon ? (
          <>
            <p className="pdp-note">This piece is not available yet. We will let you know the moment it drops.</p>
            <button
              type="button"
              className="btn block"
              style={{ marginTop: '8px' }}
              disabled={isNotifying}
              onClick={() => setIsNotifying(true)}
            >
              {isNotifying ? 'We\u2019ll Notify You' : 'Notify Me'}
            </button>
          </>
        ) : (
          <>
            <div className="qty-add" style={{ marginTop: '8px' }}>
              <div className="qty-stepper">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty(q => Math.max(1, q - 1))}>&minus;</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty(q => Math.min(9, q + 1))}>+</button>
              </div>
              <button
                className={`btn block${isAdding ? ' is-loading' : ''}`}
                style={{ flex: 1 }}
                disabled={!selectedSize || isAdding}
                onClick={handleAdd}
              >
                <span className="spinner" aria-hidden="true"></span>
                <span className="btn-label">{selectedSize ? 'Add To Bag' : 'Out Of Stock'}</span>
              </button>
            </div>
            <p className="pdp-add-msg" role="status" aria-live="polite"></p>
          </>
        )}

        <Link to={`/product/${encodeURIComponent(p.id)}`} className="qv-full-link" onClick={closeQuickView}>
          View Full Details
        </Link>
      </div>
    </>
  )
}

export default QuickViewModal