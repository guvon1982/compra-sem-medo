import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import Listagem from './pages/Listagem'
import NotFound from './pages/NotFound'

/* ============================================================
   App — define as rotas do MVP.
   Todas as rotas ficam aninhadas dentro do Layout, que
   renderiza avisos globais (estado corrompido, etc.) acima
   da tela atual via Outlet.

   A rota "*" (catch-all) captura qualquer URL desconhecida e
   mostra a tela NotFound, evitando tela branca em links
   errados ou antigos.
   ============================================================ */

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro/:id" element={<Cadastro />} />
        <Route path="/listagem" element={<Listagem />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
