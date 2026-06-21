import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Listagem from './pages/Listagem'

/* ============================================================
   App — define as rotas do MVP.
   Todas as rotas ficam aninhadas dentro do Layout, que
   renderiza avisos globais (estado corrompido, etc.) acima
   da tela atual via Outlet.
   ============================================================ */

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro/:id" element={<Cadastro />} />
        <Route path="/listagem" element={<Listagem />} />
      </Route>
    </Routes>
  )
}
