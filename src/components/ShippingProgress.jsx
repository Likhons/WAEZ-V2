import { BDT, FREE_SHIP_THRESHOLD } from '../utils/currency.js'

function ShippingProgress({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal)
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD) * 100))
  const complete = remaining <= 0

  return (
    <div className={`shipping-progress${complete ? ' is-complete' : ''}`} role="status" aria-live="polite">
      <p className="shipping-progress-msg">
        {complete ? 'You’ve unlocked free shipping.' : <>Add <strong>{BDT(remaining)}</strong> more for free shipping.</>}
      </p>
      <div className="shipping-progress-track">
        <div className="shipping-progress-fill" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  )
}

export default ShippingProgress