import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Listagem from './pages/Listagem'

/* ============================================================
   App — define as rotas do MVP.
   Estado compartilhado (catalogo, compra atual, meta, historico)
   sera centralizado em Context API + useReducer nas proximas
   features; por enquanto cada pagina usa dados mock direto.
   ============================================================ */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/listagem" element={<Listagem />} />
    </Routes>
  )
}
