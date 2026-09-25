import { Link } from 'react-router-dom'
import NewsletterForm from './NewsletterForm.jsx'

function Footer() {
  return (
    <footer className="site">
      <div className="wrap footer-top">
        <div className="footer-about">
          <div className="footer-word">WAEZ</div>
          <p className="footer-note">
            Modern essentials designed for movement, confidence and everyday expression. Dhaka & Chattogram, Bangladesh.
          </p>
          <NewsletterForm id="newsletterEmail" formClassName="newsletter-form" buttonLabel="Join" />
        </div>

        <nav className="footer-col" aria-label="Shop">
          <h4>Shop</h4>
          <Link to="/shop?cat=new">New In</Link>
          <Link to="/shop">All Products</Link>
          <Link to="/shop?cat=tees">Tees & Polos</Link>
          <Link to="/shop?cat=outerwear">Outerwear</Link>
        </nav>

        <nav className="footer-col" aria-label="About">
          <h4>About</h4>
          <Link to="/about">Our Story</Link>
          <Link to="/about">Values</Link>
          <Link to="/about">Drops Archive</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <nav className="footer-col" aria-label="Support">
          <h4>Support</h4>
          <Link to="/shipping">Shipping</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/size-guide">Size Guide</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <nav className="footer-col" aria-label="Follow WAEZ">
          <h4>Stay Close</h4>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">Pinterest</a>
        </nav>
      </div>

      <div className="wrap footer-bottom">
        <span>&copy; <span>{new Date().getFullYear()}</span> WAEZ. All rights reserved.</span>
        <div className="socials" aria-label="Social media">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TT</a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">PIN</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer