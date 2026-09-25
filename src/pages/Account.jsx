import { Link } from 'react-router-dom'

function Account() {
  return (
    <div className="wrap static-page">
      <section className="static-hero">
        <div className="eyebrow">WAEZ / Account</div>
        <h1>Sign In.</h1>
        <p className="static-lead">
          Customer accounts are on the way. In the meantime, check an order or reach out and we’ll sort it out by hand.
        </p>
      </section>

      <section className="policy-note">
        <div className="eyebrow">Coming Soon</div>
        <h2>Order tracking &amp; saved details.</h2>
        <p>
          We’re building account sign-in so you can track orders and save your details for faster checkout. Until then, your order confirmation email has everything you need.
        </p>
      </section>

      <section className="policy-contact">
        <div>
          <div className="eyebrow">Need Help Now?</div>
          <h2>Have a question about an order?</h2>
        </div>
        <Link to="/contact" className="btn">Contact Us</Link>
      </section>
    </div>
  )
}

export default Account