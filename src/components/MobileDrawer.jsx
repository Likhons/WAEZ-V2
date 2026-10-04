import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { lockScroll, unlockScroll } from '../utils/scrollLock.js'

function MobileDrawer({ isOpen, onClose, onOpenSearch }) {
  const drawerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const [overlayHidden, setOverlayHidden] = useState(true)

  useEffect(() => {
    let hideTimeout

    if (isOpen) {
      lastFocusedRef.current = document.activeElement
      lockScroll()
      setOverlayHidden(false)
      closeBtnRef.current?.focus()
    } else {
      unlockScroll()

      if (lastFocusedRef.current) {
        lastFocusedRef.current.focus()
      }

      hideTimeout = setTimeout(() => setOverlayHidden(true), 250)
    }

    return () => clearTimeout(hideTimeout)
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll('a, button')

        if (!focusables.length) return

        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <>
      <div
        className={`mobile-drawer${isOpen ? ' open' : ''}`}
        id="mobileDrawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="mobile-drawer-head">
          <span className="wordmark">WAEZ</span>

          <button
            type="button"
            className="drawer-close"
            aria-label="Close menu"
            ref={closeBtnRef}
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <nav aria-label="Mobile">
          <Link to="/shop?cat=new" onClick={onClose}>
            New In
          </Link>

          <Link to="/shop" onClick={onClose}>
            Shop
          </Link>

          <Link to="/shop?cat=tees" onClick={onClose}>
            Essentials
          </Link>

          <Link to="/about" onClick={onClose}>
            Story
          </Link>
        </nav>

        <div className="sub">
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              onClose()
              onOpenSearch()
            }}
          >
            Search
          </button>

          <Link to="/checkout" onClick={onClose}>
            Account
          </Link>

          <Link to="/cart" onClick={onClose}>
            Bag
          </Link>
        </div>
      </div>

      <div
        className={`drawer-overlay${isOpen ? ' open' : ''}`}
        hidden={overlayHidden}
        onClick={onClose}
      ></div>
    </>
  )
}

export default MobileDrawer