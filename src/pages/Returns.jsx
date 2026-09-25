import { Link } from 'react-router-dom'

function Returns() {
  return (
    <div className="wrap static-page">
      <section className="static-hero">
        <div className="eyebrow">WAEZ / Returns</div>
        <h1>Returns &amp; Exchanges.</h1>
        <p className="static-lead">
          We want you to feel right about what you order. If something isn't right, here's how our return policy works.
        </p>
      </section>

      <section className="return-steps">
        <article className="return-step">
          <span>01</span>
          <div>
            <div className="eyebrow">14 Days</div>
            <h2>Return Window</h2>
            <p>Return requests must be made within <strong>14 days of delivery</strong>.</p>
          </div>
        </article>
        <article className="return-step">
          <span>02</span>
          <div>
            <div className="eyebrow">Condition</div>
            <h2>Keep It Unworn</h2>
            <p>Items must be unworn, unused and returned with the original tags attached.</p>
          </div>
        </article>
        <article className="return-step">
          <span>03</span>
          <div>
            <div className="eyebrow">Contact</div>
            <h2>Start A Return</h2>
            <p>Contact us with your order number and reason for the return before sending anything back.</p>
          </div>
        </article>
        <article className="return-step">
          <span>04</span>
          <div>
            <div className="eyebrow">Approval</div>
            <h2>We’ll Guide You</h2>
            <p>Once your request is reviewed, we'll provide the next steps for returning the item.</p>
          </div>
        </article>
      </section>

      <section className="policy-note">
        <div className="eyebrow">Not Eligible</div>
        <h2>Items that have been worn or washed.</h2>
        <p>Items showing signs of wear, washing, damage or missing original tags may not qualify for return.</p>
      </section>

      <section className="policy-contact">
        <div>
          <div className="eyebrow">Need Help?</div>
          <h2>Still have a question?</h2>
        </div>
        <Link to="/contact" className="btn">Contact Us</Link>
      </section>
    </div>
  )
}

export default Returns