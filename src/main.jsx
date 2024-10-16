import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './context/Auth.jsx'
import ProductContextProvider from './context/Products.jsx'
import CategoryContextProvider from './context/Category.jsx'
import CartContextProvider from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ProductContextProvider>
        <CategoryContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </CategoryContextProvider>

      </ProductContextProvider>

    </AuthContextProvider>

  </StrictMode>,
)
