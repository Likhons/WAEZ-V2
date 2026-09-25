import { useState } from 'react'
import { Link } from 'react-router-dom'
import GarmentSVG from '../components/GarmentSVG.jsx'
import ShippingProgress from '../components/ShippingProgress.jsx'
import { BDT, FREE_SHIP_THRESHOLD, SHIPPING_FLAT } from '../utils/currency.js'
import { cartColorName } from '../utils/cartHelpers.js'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const { cartLines, subtotal, incrementItem, decrementItem, removeItem } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' })

  if (cartLines.length === 0) {
    return (
      <div className="wrap">
        <div className="empty-cart">
          <div className="state-icon" aria-hidden="true">—</div>
          <h2>Your bag is empty</h2>
          <p>Everything you add will show up here.</p>
          <Link to="/shop" className="btn">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT
  const total = subtotal + shipping

  function handlePromoSubmit(e) {
    e.preventDefault()
    const val = promoCode.trim()
    if (!val) {
      setPromoMsg({ text: 'Enter a promo code.', type: 'error' })
      return
    }
    setPromoMsg({ text: 'There are no active promo codes to apply right now.', type: 'info' })
  }

  return (
    <div className="wrap">
      <div className="page-strip">
        <h1>Your Bag</h1>
        <span className="count">{cartLines.length} item{cartLines.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="cart-layout">
        <div>
          {cartLines.map((l, idx) => (
            <div className="cart-item" key={idx}>
              <div className="thumb" style={{ background: l.product.bg }}>
                <GarmentSVG shape={l.product.shape} color="#141311" />
              </div>
              <div>
                <div className="ci-name">{l.product.name}</div>
                <div className="ci-meta">{cartColorName(l.product, l.item.color)} / {l.item.size}</div>
                <div className="ci-price">{BDT(l.product.price * l.item.qty)}</div>
              </div>
              <div className="ci-actions">
                <div className="qty-stepper">
                  <button type="button" className="dec" aria-label={`Decrease quantity of ${l.product.name}`} disabled={l.item.qty <= 1} onClick={() => decrementItem(idx)}>&minus;</button>
                  <span aria-live="polite">{l.item.qty}</span>
                  <button type="button" className="inc" aria-label={`Increase quantity of ${l.product.name}`} disabled={l.item.qty >= 9} onClick={() => incrementItem(idx)}>+</button>
                </div>
                <button type="button" className="remove-link" onClick={() => removeItem(idx)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="summary-box">
          <h3>Order Summary</h3>
          <ShippingProgress subtotal={subtotal} />
          <div className="summary-row"><span>Subtotal</span><span>{BDT(subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : BDT(shipping)}</span></div>
          <form className="promo" onSubmit={handlePromoSubmit}>
            <label className="visually-hidden" htmlFor="promoInput">Promo code</label>
            <input type="text" id="promoInput" placeholder="Promo code" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
            <button type="submit">Apply</button>
          </form>
          <p className={`promo-msg${promoMsg.type ? ' ' + promoMsg.type : ''}`} role="status" aria-live="polite">{promoMsg.text}</p>
          <div className="summary-row total"><span>Total</span><span>{BDT(total)}</span></div>
          <Link to="/checkout" className="btn block" style={{ marginTop: '22px' }}>Checkout</Link>
        </div>
      </div>
    </div>
  )
}

export default Cart