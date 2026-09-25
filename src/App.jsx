import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import QuickViewModal from './components/QuickViewModal.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import About from './pages/About.jsx'
import Account from './pages/Account.jsx'
import Contact from './pages/Contact.jsx'
import Shipping from './pages/Shipping.jsx'
import Returns from './pages/Returns.jsx'
import SizeGuide from './pages/SizeGuide.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmed from './pages/OrderConfirmed.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <Header />

      <main id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmed" element={<OrderConfirmed />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <div className="live-region" id="liveRegion" role="status" aria-live="polite"></div>

      <Footer />

      <CartDrawer />
      <QuickViewModal />
    </>
  )
}

export default App