import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import MobileDrawer from './MobileDrawer.jsx'
import SearchModal from './SearchModal.jsx'
import { useCart } from '../context/CartContext.jsx'

// Each /shop link now carries its own `cat` value, so active-link
// highlighting can check "does this link's category match the current
// one" per link — fixing the original's bug where all three /shop links
// shared one untracked check and only "no filter" ever lit up correctly.
const NAV_LINKS = [
  { to: '/shop?cat=new', route: '/shop', cat: 'new', label: 'New In' },
  { to: '/shop', route: '/shop', cat: '', label: 'Shop' },
  { to: '/shop?cat=tees', route: '/shop', cat: 'tees', label: 'Essentials' },
  { to: '/about', route: '/about', cat: null, label: 'Story' },
]

function Header() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { itemCount } = useCart()
  const [bump, setBump] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    function updateHeaderScrollState() {
      setIsScrolled(window.scrollY > 4)
    }
    updateHeaderScrollState()
    window.addEventListener('scroll', updateHeaderScrollState, { passive: true })
    return () => window.removeEventListener('scroll', updateHeaderScrollState)
  }, [])

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [location])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setBump(false)
    const rafId = requestAnimationFrame(() => setBump(true))
    return () => cancelAnimationFrame(rafId)
  }, [itemCount])

  const currentCat = new URLSearchParams(location.search).get('cat') || ''

  return (
    <>
      <header className={`site${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="wrap nav-row">
          <Link to="/" className="wordmark" aria-label="WAEZ, go to homepage">WAEZ</Link>

          <nav className="primary" aria-label="Primary">
            {NAV_LINKS.map(link => {
              const isActive =
                link.route === location.pathname &&
                (link.route !== '/shop' || currentCat === link.cat)
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={isActive ? 'active' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="nav-right">
            <button
              type="button"
              className="icon-link acct-txt"
              aria-haspopup="dialog"
              onClick={() => setIsSearchOpen(true)}
            >
              Search
            </button>
            <Link to="/checkout" className="icon-link acct-txt">Account</Link>
            <Link to="/cart" className="icon-link">
              Bag<span className={`bag-count${bump ? ' bump' : ''}`} aria-live="polite">{itemCount}</span>
            </Link>
            <button
              type="button"
              className="burger"
              aria-label="Open menu"
              aria-expanded={isDrawerOpen}
              aria-controls="mobileDrawer"
              onClick={() => setIsDrawerOpen(true)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}

export default Header