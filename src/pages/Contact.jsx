import { useRef, useState } from 'react'
import { fakeFetch } from '../utils/fakeFetch.js'
import { announce } from '../utils/announce.js'

function Contact() {
  const formRef = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [msg, setMsg] = useState({ text: '', type: '' })

  function handleChange(name, value) {
    setValues(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const form = formRef.current
    const fieldIds = ['contactName', 'contactEmail', 'contactMessage']
    let valid = true
    const newErrors = {}

    fieldIds.forEach(id => {
      const input = form.elements[id]
      if (!input.checkValidity()) {
        valid = false
        newErrors[id] = input.validity.valueMissing ? 'This field is required.' : 'Please enter a valid value.'
      } else {
        newErrors[id] = ''
      }
    })
    setErrors(newErrors)

    if (!valid) {
      const firstInvalid = fieldIds.map(id => form.elements[id]).find(i => !i.checkValidity())
      firstInvalid?.focus()
      return
    }

    setIsSubmitting(true)
    setMsg({ text: '', type: '' })

    fakeFetch(true, { delay: 700 }).then(() => {
      setIsSubmitting(false)
      setMsg({ text: 'Thanks — your message has been received. We’ll get back to you soon.', type: 'success' })
      setValues({ name: '', email: '', message: '' })
      announce('Your message has been sent')
    })
  }

  return (
    <div className="wrap static-page contact-page">
      <section className="static-hero">
        <div className="eyebrow">WAEZ / Contact</div>
        <h1>Get In Touch.</h1>
        <p className="static-lead">
          Questions about an order, sizing, shipping or just want to say hello? We'd love to hear from you.
        </p>
      </section>

      <section className="contact-layout">
        <div className="contact-details">
          <div className="contact-detail">
            <span className="eyebrow">Email</span>
            <a href="mailto:hello@waez.bd">hello@waez.bd</a>
          </div>
          <div className="contact-detail">
            <span className="eyebrow">Instagram</span>
            <a href="https://instagram.com/waez.bd" target="_blank" rel="noopener noreferrer">@waez.bd</a>
          </div>
          <div className="contact-detail">
            <span className="eyebrow">Phone</span>
            <a href="tel:+8801XXXXXXXXX">+880 1XXXXXXXXX</a>
          </div>
          <div className="contact-note">
            <span className="eyebrow">Response Time</span>
            <p>We usually reply within 1 business day.</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          <div className="eyebrow">Send A Message</div>
          <h2>Let's talk.</h2>

          <form id="contactForm" className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="contactName">Name</label>
              <input
                type="text" id="contactName" name="name" required autoComplete="name"
                placeholder="Your name" value={values.name}
                onChange={e => handleChange('name', e.target.value)}
              />
              <span className="field-error">{errors.contactName}</span>
            </div>

            <div className="field">
              <label htmlFor="contactEmail">Email</label>
              <input
                type="email" id="contactEmail" name="email" required autoComplete="email"
                placeholder="you@example.com" value={values.email}
                onChange={e => handleChange('email', e.target.value)}
              />
              <span className="field-error">{errors.contactEmail}</span>
            </div>

            <div className="field">
              <label htmlFor="contactMessage">Message</label>
              <textarea
                id="contactMessage" name="message" rows="6" required
                placeholder="How can we help?" value={values.message}
                onChange={e => handleChange('message', e.target.value)}
              ></textarea>
              <span className="field-error">{errors.contactMessage}</span>
            </div>

            <button type="submit" className={`btn${isSubmitting ? ' is-loading' : ''}`} disabled={isSubmitting}>
              <span className="spinner" aria-hidden="true"></span>
              <span className="btn-label">Send</span>
            </button>

            <p className={`form-msg${msg.type ? ' ' + msg.type : ''}`} role="status" aria-live="polite">{msg.text}</p>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Contact