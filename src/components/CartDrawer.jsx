import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import GarmentSVG from './GarmentSVG.jsx'
import ShippingProgress from './ShippingProgress.jsx'
import EmptyState from './EmptyState.jsx'
import { BDT } from '../utils/currency.js'
import { cartColorName } from '../utils/cartHelpers.js'
import { useCart } from '../context/CartContext.jsx'
import { lockScroll, unlockScroll } from '../utils/scrollLock.js'

function CartDrawer() {
  const { cartLines, subtotal, incrementItem, decrementItem, removeItem, isDrawerOpen, closeCartDrawer } = useCart()

  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const drawerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)

  useEffect(() => {
    let hideTimeout
    let rafId
    if (isDrawerOpen) {
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
      hideTimeout = setTimeout(() => setIsMounted(false), 260)
    }
    return () => {
      clearTimeout(hideTimeout)
      cancelAnimationFrame(rafId)
    }
  }, [isDrawerOpen])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isDrawerOpen) return
      if (e.key === 'Escape') {
        closeCartDrawer()
        return
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
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
  }, [isDrawerOpen, closeCartDrawer])

  if (!isMounted) return null

  return (
    <>
      <div className={`cart-drawer-overlay${isAnimating ? ' open' : ''}`} onClick={closeCartDrawer}></div>
      <div
        className={`cart-drawer${isAnimating ? ' open' : ''}`}
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
      >
        <div className="cart-drawer-head">
          <h2 id="cartDrawerHeading">Your Bag</h2>
          <button type="button" className="cart-drawer-close" aria-label="Close bag" ref={closeBtnRef} onClick={closeCartDrawer}>&times;</button>
        </div>

        <div className="cart-drawer-body">
          {cartLines.length === 0 ? (
            <EmptyState title="Your bag is empty" body="Add something you like and it will show up here." />
          ) : (
            cartLines.map((l, idx) => (
              <div className="cart-drawer-item" key={idx}>
                <div className="cdi-thumb" style={{ background: l.product.bg }}>
                  <GarmentSVG shape={l.product.shape} color="#141311" />
                </div>
                <div className="cdi-info">
                  <Link className="cdi-name" to={`/product/${encodeURIComponent(l.product.id)}`} onClick={closeCartDrawer}>
                    {l.product.name}
                  </Link>
                  <div className="cdi-meta">{cartColorName(l.product, l.item.color)} / {l.item.size}</div>
                  <div className="cdi-row">
                    <div className="qty-stepper">
                      <button type="button" className="cdi-dec" aria-label={`Decrease quantity of ${l.product.name}`} disabled={l.item.qty <= 1} onClick={() => decrementItem(idx)}>&minus;</button>
                      <span aria-live="polite">{l.item.qty}</span>
                      <button type="button" className="cdi-inc" aria-label={`Increase quantity of ${l.product.name}`} disabled={l.item.qty >= 9} onClick={() => incrementItem(idx)}>+</button>
                    </div>
                    <button type="button" className="remove-link cdi-remove" onClick={() => removeItem(idx)}>Remove</button>
                  </div>
                </div>
                <div className="cdi-price">{BDT(l.product.price * l.item.qty)}</div>
              </div>
            ))
          )}
        </div>

        <div className="cart-drawer-footer">
          {cartLines.length === 0 ? (
            <Link to="/shop" className="btn block" onClick={closeCartDrawer}>Continue Shopping</Link>
          ) : (
            <>
              <ShippingProgress subtotal={subtotal} />
              <div className="summary-row subtotal"><span>Subtotal</span><span>{BDT(subtotal)}</span></div>
              <p className="pdp-note" style={{ margin: '2px 0 16px' }}>Shipping and taxes calculated at checkout.</p>
              <Link to="/cart" className="btn ghost block" onClick={closeCartDrawer}>View Bag</Link>
              <Link to="/checkout" className="btn block" style={{ marginTop: '10px' }} onClick={closeCartDrawer}>Checkout</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartDrawer