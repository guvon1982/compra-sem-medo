import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import { CatalogoProvider } from './contexts/CatalogoContext'
import { CompraProvider } from './contexts/CompraContext'

/* ============================================================
   Smoke tests do App.
   Cada teste navega para uma rota distinta usando MemoryRouter
   (versao de BrowserRouter pensada para testes — guarda a URL
   na memoria, sem precisar de window.history) e confirma que
   a tela correspondente renderizou.

   As paginas dependem dos contextos para ler catalogo/compra.
   O CatalogoContext chama o produtoService.listar() no mount —
   mockamos esse modulo para nao bater na rede de verdade.
   ============================================================ */

// Mock do service: substitui as 5 funcoes por versoes async que
// devolvem uma lista fixa de produtos (sem rede).
vi.mock("./services/produtoService", () => ({
  listar: vi.fn(async () => [
    { id: "p1", nome: "Arroz Tio João 5kg", categoria: "Alimentos", unidade: "5kg", preco: 29.9 },
    { id: "p4", nome: "Leite Itambé 1L", categoria: "Bebidas", unidade: "1L", preco: 5.29 },
    { id: "p6", nome: "Macarrão Barilla 500g", categoria: "Alimentos", unidade: "500g", preco: 6.79 },
  ]),
  criar: vi.fn(async (p) => ({ ...p, id: "p-mock" })),
  obter: vi.fn(async (p) => p),
  atualizar: vi.fn(async (p) => p),
  remover: vi.fn(async () => ({})),
}));

function renderEmRota(rota) {
  return render(
    <CatalogoProvider>
      <CompraProvider>
        <MemoryRouter initialEntries={[rota]}>
          <App />
        </MemoryRouter>
      </CompraProvider>
    </CatalogoProvider>,
  )
}

describe('App', () => {
  it('renderiza a Home na rota "/"', () => {
    renderEmRota('/')
    expect(
      screen.getByText(/sob controle/i),
    ).toBeInTheDocument()
  })

  it('renderiza a tela de Cadastro na rota "/cadastro"', () => {
    renderEmRota('/cadastro')
    expect(
      screen.getByRole('heading', { name: /novo produto/i, level: 1 }),
    ).toBeInTheDocument()
  })

  it('renderiza a tela de Listagem na rota "/listagem"', () => {
    renderEmRota('/listagem')
    expect(
      screen.getByRole('heading', { name: /^compra$/i, level: 1 }),
    ).toBeInTheDocument()
  })
})
