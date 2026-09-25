function Shipping() {
  return (
    <div className="wrap static-page">
      <section className="static-hero">
        <div className="eyebrow">WAEZ / Shipping</div>
        <h1>Shipping &amp; Delivery.</h1>
        <p className="static-lead">
          We deliver WAEZ orders across Bangladesh. Here's everything you need to know before placing your order.
        </p>
      </section>

      <section className="policy-grid">
        <article className="policy-card">
          <span className="policy-number">01</span>
          <div className="eyebrow">Dhaka</div>
          <h2>Inside Dhaka</h2>
          <p>Delivery usually takes <strong>2&ndash;3 business days</strong> after your order is confirmed.</p>
        </article>
        <article className="policy-card">
          <span className="policy-number">02</span>
          <div className="eyebrow">Bangladesh</div>
          <h2>Outside Dhaka</h2>
          <p>Delivery usually takes <strong>3&ndash;5 business days</strong> after your order is confirmed.</p>
        </article>
        <article className="policy-card">
          <span className="policy-number">03</span>
          <div className="eyebrow">Shipping Charge</div>
          <h2>BDT 120</h2>
          <p>Standard delivery is BDT 120. Orders above BDT 3,000 qualify for free shipping.</p>
        </article>
        <article className="policy-card">
          <span className="policy-number">04</span>
          <div className="eyebrow">Processing</div>
          <h2>2 Business Days</h2>
          <p>Orders are normally dispatched within 2 business days after confirmation.</p>
        </article>
      </section>

      <section className="policy-note">
        <div className="eyebrow">Please Note</div>
        <h2>Delivery times are estimates.</h2>
        <p>Delivery may take a little longer during campaigns, public holidays, weekends or periods of unusually high order volume.</p>
      </section>
    </div>
  )
}

export default Shipping