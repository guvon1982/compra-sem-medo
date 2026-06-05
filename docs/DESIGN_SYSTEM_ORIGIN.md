# Origem do Design System

O Design System usado no projeto (`src/components/`, `src/pages/`, `src/styles/`, `src/utils/currency.js`, `src/data/mock.js`) foi gerado em **Claude Design** (claude.ai/design) a partir do briefing aprovado e do mockup visual aprovado (`docs/CompraSemMedo_DesignSystem_Aprovacao.png`).

## Processo

1. PRD, identidade visual e mockup aprovado serviram de base.
2. Briefing detalhado foi enviado ao Claude Design (tokens travados em hex, lista de componentes, anti-padroes, regras de HTML semantico, mock data brasileiro).
3. Handoff resultante foi salvo em `docs/DesignSystema - Compra Sem Medo-handoff/` para referencia.
4. Os arquivos `src/` foram **adotados como base**, com adaptacoes minimas:
   - Navegacao por prop `onNavigate` substituida pelo `useNavigate` do `react-router` v7.
   - Smoke tests adicionados.
   - Eventuais correcoes de acessibilidade ou de aderencia ao stack.

## Por que adotar em vez de reconstruir

- Aderencia perfeita aos hex aprovados.
- HTML semantico, acessibilidade e BEM ja aplicados de forma consistente.
- Tokens, base CSS e componentes seguem o padrao discutido no PRD.
- Comentarios em cada arquivo explicam decisoes de design.
- Tempo economizado (estimado em ~10h) reaproveitado nas features de F1-F11.

## O que NAO foi reaproveitado

- O `bundle.jsx` e `preview/` (sao apenas do preview interativo do Claude Design, nao codigo de producao).
- O `index.html` do handoff (temos o nosso, gerado pelo Vite).
- A logica de navegacao por estado (`onNavigate`) — adaptada para `react-router`.

## Direitos / licenca

Saida do Claude Design pertence ao usuario que solicitou. Sem restricoes de uso.

## Referencias

- Pasta original do handoff: `docs/DesignSystema - Compra Sem Medo-handoff/`
- Briefing visual aprovado: `docs/CompraSemMedo_DesignSystem_Aprovacao.png`
- Regras visuais textuais: `docs/design-system-reference.md`
