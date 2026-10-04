import { Link } from 'react-router-dom'
import GarmentSVG from '../components/GarmentSVG.jsx'
import NewsletterForm from '../components/NewsletterForm.jsx'
import { PRODUCTS } from '../data/products.js'
import ProductGrid from '../components/ProductGrid.jsx'

// Home-page-only category tiles. (Not the same as the Shop page's filter
// list — that's a separate, differently-shaped array that comes in
// Block 9.)
const CATEGORY_TILES = [
  { key: 'tees', label: 'Tees & Polos', shape: 'tee', bg: 'var(--taupe-1)' },
  { key: 'outerwear', label: 'Outerwear', shape: 'jacket', bg: 'var(--taupe-6)' },
  { key: 'bottoms', label: 'Bottoms', shape: 'trouser', bg: 'var(--taupe-4)' },
  { key: 'new', label: 'New In', shape: 'hoodie', bg: 'var(--taupe-2)' },
]

const stripStyle = { borderBottom: '1px solid var(--line)' }

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow">WAEZ / Drop 01</div>
          <h1>WEAR YOUR<br />WAY.</h1>
          <p>Modern essentials designed for movement, confidence and everyday expression.</p>
          <div className="hero-actions">
            <Link to="/shop?cat=new" className="btn">Shop The Drop</Link>
            <Link to="/shop" className="btn ghost">Shop All</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-frame">
            <span className="frame-tag">WAEZ / Form 01</span>
            <div className="hero-garment"><GarmentSVG shape="tee" color="#141311" /></div>
            <div className="hero-garment-label">WAEZ<br />Essential / 001</div>
          </div>
        </div>
      </section>

      <section className="new-drop wrap" aria-labelledby="newDropHeading">
        <div className="new-drop-panel">
          <div className="new-drop-text">
            <div className="eyebrow">Just Landed</div>
            <h2 id="newDropHeading">Drop 01 is live.</h2>
            <p>Twelve pieces, one fabric problem solved at a time. Heavyweight cottons and structured outerwear, built to earn a place in daily rotation.</p>
            <Link to="/shop?cat=new" className="btn ghost">Shop The Drop</Link>
          </div>
          <div className="new-drop-visual" style={{ background: 'var(--taupe-2)' }}>
            <GarmentSVG shape="hoodie" color="#141311" />
          </div>
        </div>
      </section>

      <section className="wrap home-section" aria-labelledby="categoryHeading">
        <div className="page-strip" style={stripStyle}>
          <h2 id="categoryHeading" className="section-title">Shop By Category</h2>
          <span className="count">4 Collections</span>
        </div>
        <div className="category-grid">
          {CATEGORY_TILES.map(c => (
            <Link key={c.key} className="category-tile" to={`/shop?cat=${c.key}`}>
              <div className="category-media" style={{ background: c.bg }}>
                <GarmentSVG shape={c.shape} color="#141311" />
              </div>
              <div className="category-label">
                <span>{c.label}</span>
                <span className="category-arrow" aria-hidden="true">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap home-section" aria-labelledby="featuredHeading">
        <div className="page-strip" style={stripStyle}>
          <h2 id="featuredHeading" className="section-title">Featured Products</h2>
          <Link to="/shop" className="count view-all">View All</Link>
        </div>
        <div style={{ marginTop: '32px' }}>
          <ProductGrid products={PRODUCTS.slice(0, 8)} />
        </div>
      </section>

      <section className="brand-story wrap" aria-labelledby="storyHeading">
        <div className="brand-story-visual" style={{ background: 'var(--taupe-5)' }}>
          <GarmentSVG shape="shirt" color="#141311" />
        </div>
        <div className="brand-story-text">
          <div className="eyebrow">Our Story</div>
          <h2 id="storyHeading">Clothes built for how you actually move through a day.</h2>
          <p>WAEZ started in 2024 as a small pattern-making studio in Chattogram. Every piece we make has to earn its place: in a commute, a work day, a night out, and back again the next morning.</p>
          <Link to="/about" className="btn ghost">Read Our Story</Link>
        </div>
      </section>

      <section className="editorial" aria-labelledby="editorialHeading">
        <div className="editorial-media"><GarmentSVG shape="jacket" color="rgba(245,242,234,0.9)" /></div>
        <div className="wrap editorial-inner">
          <div className="eyebrow" style={{ color: 'var(--taupe-2)' }}>Campaign / Drop 01</div>
          <h2 id="editorialHeading">Built for the walk, the meeting, and everything after.</h2>
          <Link to="/shop" className="btn">Explore The Lookbook</Link>
        </div>
      </section>

      <HomeNewsletter />
    </>
  )
}

// Same validation pattern as the Footer's newsletter form, kept separate
// since the original site also wired these as two independent forms with
// their own ids/classes (home-newsletter-form vs newsletter-form).
function HomeNewsletter() {
  return (
    <section className="home-newsletter wrap" aria-labelledby="newsletterHeading">
      <h2 id="newsletterHeading">Get the next drop first.</h2>
      <p>Join the list for early access, restock alerts, and the occasional studio update.</p>
      <NewsletterForm id="homeNewsletterEmail" formClassName="home-newsletter-form" buttonLabel="Join The List" buttonClassName="btn" />
    </section>
  )
}

export default Home