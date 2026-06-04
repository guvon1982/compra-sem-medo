## O que entra

<!-- Liste em bullets as mudancas principais desta PR. Use linguagem objetiva.
     Exemplo:
     - Adiciona componente `Button` com variantes primary/ghost/danger.
     - Configura `BrowserRouter` com rotas `/`, `/cadastro`, `/listagem`.
-->

-

## Como validar

<!-- Passo a passo que o revisor (ou voce mesmo) consegue seguir para confirmar
     que a mudanca funciona localmente. Sempre comecar pelos comandos.
     Exemplo:
     - `docker compose exec app npm run dev` -> abrir http://localhost:5173
     - Acessar /cadastro, preencher o formulario, validar mensagem de erro nos campos obrigatorios.
-->

-

## Checklist

- [ ] Codigo segue o design system (`docs/design-system-reference.md`) e a paleta aprovada.
- [ ] HTML semantico (sem `<div>` desnecessario).
- [ ] Componentes reaproveitados quando aplicavel; novos componentes justificados.
- [ ] Testes adicionados/atualizados quando relevante.
- [ ] `npm run lint`, `npm run test:run` e `npm run build` rodam sem erro localmente.
- [ ] Sem segredos commitados (`.env`, chaves de API).
- [ ] PR aponta para `develop` (nunca para `main` fora de release).
