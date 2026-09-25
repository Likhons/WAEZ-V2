import GarmentSVG from '../components/GarmentSVG.jsx'

function About() {
  return (
    <div className="wrap static-page about-page">
      <section className="static-hero about-hero">
        <div className="eyebrow">WAEZ / Our Story</div>
        <h1>Clothes built for how you actually move through a day.</h1>
        <p className="static-lead">
          WAEZ started in 2024 as a small pattern-making studio in Chattogram, frustrated by essentials that looked good on a hanger and nowhere else.
        </p>
        <p>
          We believe everyday clothing should feel considered without feeling complicated. Every piece is designed around movement, comfort, proportion and repeat wear.
        </p>
      </section>

      <section className="static-visual about-band" aria-hidden="true">
        <GarmentSVG shape="shirt" color="#141311" />
        <div className="visual-label">WAEZ / FORM 01<br />EVERYDAY ESSENTIALS</div>
      </section>

      <section className="static-copy-grid">
        <div className="static-copy">
          <div className="eyebrow">01 / Approach</div>
          <h2>Small drops.<br />Better decisions.</h2>
          <p>
            We design in small, deliberate drops rather than constant releases. Each collection starts from one fabric, one silhouette or one everyday problem we want to solve.
          </p>
          <p>
            We don't move on until the piece feels right. That's why our collections stay small and why our essentials are designed to stay relevant beyond one season.
          </p>
        </div>
        <div className="static-copy">
          <div className="eyebrow">02 / Materials</div>
          <h2>Made to be<br />worn repeatedly.</h2>
          <p>
            We work with heavyweight cottons, structured twills and brushed fleece selected for everyday durability, comfort and shape.
          </p>
          <p>
            The goal isn't to make more clothes. It's to make pieces you'll actually want to wear again tomorrow.
          </p>
        </div>
      </section>

      <section className="values">
        <article className="value-card">
          <div className="num">01</div>
          <h3>Made to be worn out</h3>
          <p>Fit is considered around real movement, real bodies and real days &mdash; not just how something looks standing still.</p>
        </article>
        <article className="value-card">
          <div className="num">02</div>
          <h3>Small, considered runs</h3>
          <p>We produce close to what we expect to sell. Fewer units, less waste and less disposable clothing.</p>
        </article>
        <article className="value-card">
          <div className="num">03</div>
          <h3>Local first</h3>
          <p>Designed and developed with a Bangladesh-first mindset and a supply chain we can understand and improve.</p>
        </article>
      </section>

      <section className="drops-timeline">
        <div className="page-strip">
          <h2>Drops Archive</h2>
          <span className="count">2024 &mdash; 2026</span>
        </div>
        <div className="drop-row">
          <div className="yr">2024</div>
          <div className="ttl">Studio Zero</div>
          <p className="dsc">The first WAEZ run &mdash; four tee fits tested privately before release.</p>
        </div>
        <div className="drop-row">
          <div className="yr">2025</div>
          <div className="ttl">Form &amp; Function</div>
          <p className="dsc">Structured outerwear and our first bottoms line entered the collection.</p>
        </div>
        <div className="drop-row">
          <div className="yr">2026</div>
          <div className="ttl">Drop 01</div>
          <p className="dsc">Our most refined essentials range yet &mdash; the current collection.</p>
        </div>
      </section>
    </div>
  )
}

export default About