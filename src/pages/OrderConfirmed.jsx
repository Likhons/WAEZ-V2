import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { announce } from '../utils/announce.js'

function OrderConfirmed() {
  const location = useLocation()
  const navigate = useNavigate()
  const justPlacedOrder = !!location.state?.justPlacedOrder
  const [orderId] = useState(() => 'WAEZ-' + Math.floor(100000 + Math.random() * 900000))

  useEffect(() => {
    if (!justPlacedOrder) {
      navigate('/shop', { replace: true })
      return
    }
    announce('Order confirmed')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!justPlacedOrder) return null

  return (
    <div className="wrap">
      <div className="confirm-screen">
        <div className="mark" aria-hidden="true">&#10003;</div>
        <h1>Order Confirmed</h1>
        <p>Thank you &mdash; your order has been placed successfully.</p>
        <div className="oid">Order {orderId}</div>
        <Link to="/shop" className="btn">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default OrderConfirmed