import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { QuickViewProvider } from './context/QuickViewContext.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <WishlistProvider>
        <CartProvider>
          <QuickViewProvider>
            <App />
          </QuickViewProvider>
        </CartProvider>
      </WishlistProvider>
    </HashRouter>
  </StrictMode>,
)