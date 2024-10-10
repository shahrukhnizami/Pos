import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './context/Auth.jsx'
import ProductContextProvider, { ProductContext } from './context/Products.jsx'
import CategoryContextProvider from './context/Category.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <ProductContextProvider>
        <CategoryContextProvider>

          <App />
        </CategoryContextProvider>

      </ProductContextProvider>

    </AuthContextProvider>

  </StrictMode>,
)
