import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GarmentSVG from '../components/GarmentSVG.jsx'
import { BDT, FREE_SHIP_THRESHOLD, SHIPPING_FLAT } from '../utils/currency.js'
import { cartColorName } from '../utils/cartHelpers.js'
import { useCart } from '../context/CartContext.jsx'
import { fakeFetch } from '../utils/fakeFetch.js'
import { checkoutState } from '../utils/checkoutState.js'

function Checkout() {
  const { cartLines } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (cartLines.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [cartLines.length, navigate])

  if (cartLines.length === 0) return null

  return <CheckoutForm />
}

function Field({ id, label, type = 'text', required = true, placeholder, autoComplete, value, onChange, onBlur, error, full }) {
  return (
    <div className={`field${full ? ' full' : ''}${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <span className="field-error" data-error-for={id}>{error}</span>
    </div>
  )
}

function CheckoutForm() {
  const { cartLines, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const formRef = useRef(null)

  const [formValues, setFormValues] = useState(() => ({
    email: '', firstName: '', lastName: '', address: '', city: '', postal: '', phone: '',
    cardNumber: '', expiry: '', cvc: '',
    ...checkoutState.formData,
  }))
  const [payMethod, setPayMethod] = useState(checkoutState.payMethod)
  const [touched, setTouched] = useState({})
  const [errors, setErrors] = useState({})
  const [errorBannerVisible, setErrorBannerVisible] = useState(false)
  const [errorBannerText, setErrorBannerText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT
  const total = subtotal + shipping

  function validateField(name) {
    const input = formRef.current?.elements[name]
    if (!input) return true
    if (!input.checkValidity()) {
      setErrors(prev => ({ ...prev, [name]: input.validity.valueMissing ? 'This field is required.' : 'Please enter a valid value.' }))
      return false
    }
    setErrors(prev => ({ ...prev, [name]: '' }))
    return true
  }

  function handleChange(name, value) {
    setFormValues(prev => {
      const next = { ...prev, [name]: value }
      checkoutState.formData = next
      return next
    })
    if (touched[name]) {
      validateField(name)
      const stillHasErrors = Object.values({ ...errors, [name]: undefined }).some(Boolean)
      if (!stillHasErrors) setErrorBannerVisible(false)
    }
  }

  function handleBlur(name) {
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name)
  }

  function handlePayMethodChange(method) {
    setPayMethod(method)
    checkoutState.payMethod = method
    if (method !== 'card') {
      setErrors(prev => ({ ...prev, cardNumber: '', expiry: '', cvc: '' }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = formRef.current
    const requiredInputs = Array.from(form.querySelectorAll('input[required]'))
    let allValid = true
    const newTouched = { ...touched }
    const newErrors = { ...errors }
    requiredInputs.forEach(input => {
      newTouched[input.name] = true
      if (!input.checkValidity()) {
        allValid = false
        newErrors[input.name] = input.validity.valueMissing ? 'This field is required.' : 'Please enter a valid value.'
      } else {
        newErrors[input.name] = ''
      }
    })
    setTouched(newTouched)
    setErrors(newErrors)

    if (!allValid) {
      setErrorBannerText('Please fix the highlighted fields before placing your order.')
      setErrorBannerVisible(true)
      requiredInputs.find(i => !i.checkValidity())?.focus()
      return
    }
    setErrorBannerVisible(false)
    setIsSubmitting(true)

    fakeFetch(true, { delay: 900 })
      .then(() => {
        clearCart()
        checkoutState.formData = {}
        checkoutState.payMethod = 'card'
        navigate('/order-confirmed', { state: { justPlacedOrder: true } })
      })
      .catch(() => {
        setIsSubmitting(false)
        setErrorBannerText('We could not process your order. Please try again.')
        setErrorBannerVisible(true)
      })
  }

  return (
    <div className="wrap">
      <div className="page-strip">
        <h1>Checkout</h1>
        <span className="count">{cartLines.length} item{cartLines.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="co-steps" aria-hidden="true">
        <span className="co-step"><span className="dot"></span>Bag</span>
        <span className="co-sep">&mdash;</span>
        <span className="co-step active"><span className="dot"></span>Checkout</span>
        <span className="co-sep">&mdash;</span>
        <span className="co-step"><span className="dot"></span>Confirmation</span>
      </div>

      <div className="checkout-layout">
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className={`checkout-error${errorBannerVisible ? ' show' : ''}`} role="alert">{errorBannerText}</div>

          <fieldset>
            <legend>Contact</legend>
            <div className="field-row">
              <Field
                id="email" label="Email" type="email" full
                placeholder="you@example.com" autoComplete="email"
                value={formValues.email} error={errors.email}
                onChange={e => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Shipping Address</legend>
            <div className="field-row">
              <Field id="firstName" label="First Name" autoComplete="given-name" value={formValues.firstName} error={errors.firstName} onChange={e => handleChange('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} />
              <Field id="lastName" label="Last Name" autoComplete="family-name" value={formValues.lastName} error={errors.lastName} onChange={e => handleChange('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} />
            </div>
            <div className="field-row">
              <Field id="address" label="Address" full placeholder="House, Road, Area" autoComplete="street-address" value={formValues.address} error={errors.address} onChange={e => handleChange('address', e.target.value)} onBlur={() => handleBlur('address')} />
            </div>
            <div className="field-row">
              <Field id="city" label="City" placeholder="e.g. Dhaka" autoComplete="address-level2" value={formValues.city} error={errors.city} onChange={e => handleChange('city', e.target.value)} onBlur={() => handleBlur('city')} />
              <Field id="postal" label="Postal Code" autoComplete="postal-code" value={formValues.postal} error={errors.postal} onChange={e => handleChange('postal', e.target.value)} onBlur={() => handleBlur('postal')} />
            </div>
            <div className="field-row">
              <Field id="phone" label="Phone" type="tel" full placeholder="+880" autoComplete="tel" value={formValues.phone} error={errors.phone} onChange={e => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <div className="pay-methods" role="group" aria-label="Payment method">
              <button type="button" className="pay-method" aria-pressed={payMethod === 'card'} onClick={() => handlePayMethodChange('card')}>Card</button>
              <button type="button" className="pay-method" aria-pressed={payMethod === 'bkash'} onClick={() => handlePayMethodChange('bkash')}>bKash</button>
              <button type="button" className="pay-method" aria-pressed={payMethod === 'cod'} onClick={() => handlePayMethodChange('cod')}>Cash on Delivery</button>
            </div>
            <div id="cardFields" style={{ display: payMethod === 'card' ? 'block' : 'none' }}>
              <div className="field-row">
                <Field
                  id="cardNumber" label="Card Number" full placeholder="0000 0000 0000 0000" autoComplete="cc-number"
                  required={payMethod === 'card'} value={formValues.cardNumber} error={errors.cardNumber}
                  onChange={e => handleChange('cardNumber', e.target.value)} onBlur={() => handleBlur('cardNumber')}
                />
              </div>
              <div className="field-row">
                <Field id="expiry" label="Expiry" placeholder="MM / YY" autoComplete="cc-exp" required={payMethod === 'card'} value={formValues.expiry} error={errors.expiry} onChange={e => handleChange('expiry', e.target.value)} onBlur={() => handleBlur('expiry')} />
                <Field id="cvc" label="CVC" placeholder="123" autoComplete="cc-csc" required={payMethod === 'card'} value={formValues.cvc} error={errors.cvc} onChange={e => handleChange('cvc', e.target.value)} onBlur={() => handleBlur('cvc')} />
              </div>
            </div>
          </fieldset>

          <button type="submit" className={`btn block${isSubmitting ? ' is-loading' : ''}`} disabled={isSubmitting}>
            <span className="spinner" aria-hidden="true"></span>
            <span className="btn-label">Place Order &mdash; {BDT(total)}</span>
          </button>
        </form>

        <div className="co-summary">
          <div className="co-summary-head">
            <h3>Order Summary</h3>
            <Link to="/cart" className="size-guide-link">Edit Bag</Link>
          </div>
          {cartLines.map((l, idx) => (
            <div className="co-line-item" key={idx}>
              <div className="thumb" style={{ background: l.product.bg }}>
                <GarmentSVG shape={l.product.shape} color={l.product.colors[l.item.color]} />
              </div>
              <div className="info">
                <div className="n">{l.product.name}</div>
                <div className="m">{cartColorName(l.product, l.item.color)} &middot; Size {l.item.size} &middot; Qty {l.item.qty}</div>
              </div>
              <div className="p">{BDT(l.product.price * l.item.qty)}</div>
            </div>
          ))}
          <div className="summary-row" style={{ marginTop: '14px' }}><span>Subtotal</span><span>{BDT(subtotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'Free' : BDT(shipping)}</span></div>
          <div className="summary-row total"><span>Total</span><span>{BDT(total)}</span></div>
        </div>
      </div>
    </div>
  )
}

export default Checkout