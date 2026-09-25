import { useRef, useState } from 'react'

function NewsletterForm({ id, formClassName, buttonLabel, buttonClassName = '' }) {
  const emailInputRef = useRef(null)
  const [msg, setMsg] = useState({ text: '', type: '' })

  function handleSubmit(e) {
    e.preventDefault()
    const input = emailInputRef.current
    if (!input.checkValidity()) {
      setMsg({ text: 'Please enter a valid email address.', type: 'error' })
      input.focus()
      return
    }
    setMsg({ text: `Thanks — we'll send drops to ${input.value}.`, type: 'success' })
    input.value = ''
  }

  return (
    <>
      <form className={formClassName} onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor={id}>Email address</label>
        <input
          type="email"
          id={id}
          name="email"
          placeholder="Your email"
          required
          autoComplete="email"
          ref={emailInputRef}
        />
        <button type="submit" className={buttonClassName}>{buttonLabel}</button>
      </form>
      <p className={`form-msg${msg.type ? ' ' + msg.type : ''}`} role="status" aria-live="polite">
        {msg.text}
      </p>
    </>
  )
}

export default NewsletterForm