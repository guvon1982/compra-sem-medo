import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { CatalogoProvider } from './contexts/CatalogoContext.jsx'
import { CompraProvider } from './contexts/CompraContext.jsx'
import './index.css'

/* ============================================================
   Ordem dos providers:
   CatalogoProvider envolve CompraProvider porque a compra
   referencia produtos pelo id (sempre que o componente
   precisar transformar { id, quantity } em algo "humano",
   ele cruza com o catalogo). Manter essa ordem deixa claro
   o sentido da dependencia.
   ============================================================ */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CatalogoProvider>
      <CompraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CompraProvider>
    </CatalogoProvider>
  </StrictMode>,
)
