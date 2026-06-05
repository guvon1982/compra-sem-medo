import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, it, expect } from 'vitest'
import App from './App'

/* ============================================================
   Smoke tests do App.
   Cada teste navega para uma rota distinta usando MemoryRouter
   (versao de BrowserRouter pensada para testes — guarda a URL
   na memoria, sem precisar de window.history) e confirma que
   a tela correspondente renderizou.
   ============================================================ */

function renderEmRota(rota) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <App />
    </MemoryRouter>,
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
