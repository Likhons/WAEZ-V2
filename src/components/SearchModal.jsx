import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GarmentSVG from './GarmentSVG.jsx'
import { BDT } from '../utils/currency.js'
import { searchProducts } from '../services/productService.js'
import { lockScroll, unlockScroll } from '../utils/scrollLock.js'

const RESULTS_LIMIT = 8
const DEBOUNCE_MS = 180

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  // isMounted keeps the modal in the DOM during the 200ms close transition
  // (matches the original's setTimeout(..., 200) before hidden = true).
  const [isMounted, setIsMounted] = useState(false)
  // isAnimating controls the 'open' class, added one frame after mounting
  // so the CSS transition actually plays (matches the original's
  // requestAnimationFrame(() => classList.add('open')) trick).
  const [isAnimating, setIsAnimating] = useState(false)

  const inputRef = useRef(null)
  const modalRef = useRef(null)
  const lastFocusedRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let hideTimeout
    let rafId
    if (isOpen) {
      lastFocusedRef.current = document.activeElement
      setQuery('')
      setDebouncedQuery('')
      setIsMounted(true)
      lockScroll()
      rafId = requestAnimationFrame(() => {
        setIsAnimating(true)
        inputRef.current?.focus()
      })
    } else {
      setIsAnimating(false)
      unlockScroll()
      if (lastFocusedRef.current) lastFocusedRef.current.focus()
      hideTimeout = setTimeout(() => setIsMounted(false), 200)
    }
    return () => {
      clearTimeout(hideTimeout)
      cancelAnimationFrame(rafId)
    }
  }, [isOpen])

  // Debounced search-as-you-type, same 180ms delay as the original.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
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
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  function handleSubmit(e) {
    e.preventDefault()
    goToResults(query)
  }

  function goToResults(q) {
    const trimmed = q.trim()
    if (!trimmed) return
    onClose()
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`)
  }

  const trimmedDebounced = debouncedQuery.trim()
  const results = useMemo(
    () => (trimmedDebounced ? searchProducts(trimmedDebounced) : []),
    [trimmedDebounced]
  )

  if (!isMounted) return null

  const shown = results.slice(0, RESULTS_LIMIT)

  return (
    <>
      <div className={`search-overlay${isAnimating ? ' open' : ''}`} onClick={onClose}></div>
      <div
        className={`search-modal${isAnimating ? ' open' : ''}`}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <form className="search-head" onSubmit={handleSubmit}>
          <svg className="search-icon" width="17" height="17" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <line x1="13.6" y1="13.6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <label className="visually-hidden" htmlFor="searchInput">Search products</label>
          <input
            type="text"
            id="searchInput"
            placeholder="Search WAEZ"
            autoComplete="off"
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="button" className="search-close" aria-label="Close search" onClick={onClose}>&times;</button>
        </form>

        <div className="search-body">
          {!trimmedDebounced ? (
            <p className="search-hint">Search by product name, category or fabric.</p>
          ) : results.length === 0 ? (
            <div className="search-empty">No products found for &ldquo;{trimmedDebounced}&rdquo;.</div>
          ) : (
            <>
              <div className="search-count">{results.length} Product{results.length !== 1 ? 's' : ''}</div>
              {shown.map(p => (
                <Link key={p.id} className="search-result" to={`/product/${encodeURIComponent(p.id)}`} onClick={onClose}>
                  <div className="thumb" style={{ background: p.bg }}>
                    <GarmentSVG shape={p.shape} color={p.mark} />
                  </div>
                  <div className="info">
                    <div className="n">{p.name}</div>
                    <div className="c">{p.cat}</div>
                  </div>
                  <div className="p">{BDT(p.price)}</div>
                </Link>
              ))}
              {results.length > shown.length && (
                <Link className="search-viewall" to={`/shop?search=${encodeURIComponent(trimmedDebounced)}`} onClick={onClose}>
                  View all {results.length} results
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default SearchModal