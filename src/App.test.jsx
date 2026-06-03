import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App (smoke test)', () => {
  it('renderiza o titulo "Get started"', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /get started/i }),
    ).toBeInTheDocument()
  })

  it('incrementa o contador quando o botao e clicado', async () => {
    const user = userEvent.setup()
    render(<App />)

    const botao = screen.getByRole('button', { name: /count is 0/i })
    await user.click(botao)

    expect(
      screen.getByRole('button', { name: /count is 1/i }),
    ).toBeInTheDocument()
  })
})
