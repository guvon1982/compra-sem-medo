# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual do projeto

Projeto final de Front-End (IESB, 5o semestre). Desenvolvimento **individual** por `guvon1982`.

**Repositorio no GitHub:** https://github.com/guvon1982/compra-sem-medo (publico).
**Branch padrao:** `develop`. **Branch atual de trabalho:** a ser criada (`feature/context-estado`) — proxima entrega e a Fase 4.

### O que ja foi feito

- **PR #1 mergeado em `develop` (2026-06-03):** scaffold Vite + React 19, stack instalada (`react-router` v7, `react-hook-form`, `lucide-react`, `vitest`, `@testing-library/*`, `jsdom`, `@vitest/ui`), Vitest configurado em `vite.config.js`, `src/test/setup.js`, scripts npm (`dev`, `build`, `preview`, `lint`, `test`, `test:run`, `test:ui`, `test:coverage`), fonte Inter, `lang="pt-BR"`, `theme-color #22C55E`, `.gitignore` consolidado, Vite com `server.host: true` e `usePolling: true`, smoke test do App (2 testes passando).

- **PR #2 mergeado (2026-06-04):** ambiente Docker (`docker-compose.yml` com `node:24`, ports 5173/4173/3000, `container_name: compra-sem-medo-app`), `.dockerignore`, `README.md` reescrito do zero. Validado funcionando dentro do container.
- **PR #3 mergeado (2026-06-04):** CI ativo. `.github/workflows/pr-checks.yml` roda install + lint + `npm run test:run` + `npm run build` em Node 24 em todo PR para `develop` ou `main`. `.github/pull_request_template.md` padroniza descricao de PRs.
- **Protecao de branch via Rulesets (2026-06-04):**
  - `Protect develop`: requer PR, requer check `Lint, testes e build` verde, bloqueia force push.
  - `Protect main`: idem + `Restrict deletions` + `Require linear history`.
  - Validado: push direto em `main` rejeitado com `GH013`.
- **PR #4 mergeado (2026-06-05):** Design System integrado do handoff do Claude Design (ver `docs/DESIGN_SYSTEM_ORIGIN.md`).
  - **Estrutura:** `src/styles/{tokens,base,layout}.css`, 12 componentes em `src/components/` (Button, Input, Card, ProductItem, ShoppingListItem, BudgetProgress, Header, BottomNavigation, AlertMessage, EmptyState, Icon — 24 SVGs custom, Logo — carrinho com cadeado), 3 paginas em `src/pages/` (Home, Cadastro, Listagem com 3 abas + modal de finalizar), `src/data/mock.js` com produtos brasileiros, `src/utils/currency.js`.
  - **Adaptacoes:** roteamento `react-router` v7 com `BrowserRouter` em `main.jsx` + `<Routes>` em `App.jsx`; `BottomNavigation` usa `<NavLink>` (detecta rota ativa sozinho); paginas usam `useNavigate`; named imports de hooks (sem `React.useX`); `Header` mostra titulo mesmo sem `onBack`; mensagem de sucesso do Cadastro reformulada.
  - **Layout responsivo:** mobile-first ate 767px; ≥ 768px centraliza em `--app-max-width: 480px` com bordas finas (sem mockup de celular).
  - **Testes:** `src/App.test.jsx` cobre as 3 rotas com `MemoryRouter` — 3 passando.
  - **ESLint:** `docs/**` adicionado a `globalIgnores` (handoff e referencia, nao codigo do app).

### Limitacao conhecida (esperada — sera resolvida na Fase 4)

Cada pagina mantem estado local com dados mock. Em particular:
- Cadastro mostra alerta de sucesso mas **nao persiste o produto** no catalogo da Listagem.
- Home calcula seu proprio total a partir de `COMPRA_INICIAL` (mock); Listagem mantem seu proprio `compraEntries`. Os dois nao se enxergam.
- Historico arquivado na Listagem nao sobrevive a reload.

### Proxima fase — Fase 4 — `feature/context-estado`

Centralizar o estado em Context API + useReducer.

1. Criar `src/contexts/CatalogoContext.jsx` (provider + reducer): estado `{ produtos }`, acoes `adicionarProduto`, `editarProduto`, `removerProduto`. Inicializa com `PRODUTOS` do mock.
2. Criar `src/contexts/CompraContext.jsx` (provider + reducer): estado `{ compraAtual, meta, historicoCompras }`, acoes `adicionarItem(produtoId)`, `incrementar(id)`, `decrementar(id)`, `removerItem(id)`, `definirMeta(valor)`, `finalizarCompra()`. Inicializa com `COMPRA_INICIAL`/`META_INICIAL`/`HISTORICO` do mock.
3. Wrappar `<App />` em `main.jsx` com os dois providers (ordem: Catalogo > Compra, pois compra referencia produtos pelo id).
4. Substituir `useState` local nas paginas por `useContext` + `dispatch`. Listagem fica bem mais enxuta; Cadastro injeta no catalogo de verdade; Home mostra compra real.
5. Smoke tests para reducers (entrada -> acao -> estado esperado).
6. Mock data continua existindo so como seed inicial dos contextos — depois ele sai quando entrar json-server (Fase 5).

### Decisoes pendentes — CRUD de produtos

Levantado durante o teste manual da Fase 4 (2026-06-05). Precisa ser tratado em **branch propria** apos o merge da Fase 4 (sugestao: `feature/produto-crud`):

- **Confirmar escopo:** ler `docs/PRD.md` e checar se editar/remover produto esta nas F1-F11. Se nao estiver, decidir com o usuario se promove para MVP ou deixa pos-MVP.
- **Decisoes de design ainda em aberto:**
  - Onde mora a UI de editar/remover? Dentro do `ProductItem` na aba Catalogo (icones de acao)? Tela nova `/produto/:id`?
  - Politica de **referencia orfa**: se o usuario remover um produto que esta na `compraAtual` ou no `historicoCompras`, o que acontece? Opcoes: (a) bloquear remocao se houver referencia; (b) remover do catalogo mas manter no historico como "produto descontinuado"; (c) cascata (remove tambem dos lugares onde aparece — perigoso para historico).
  - Sao editaveis os produtos do `mock.js` (seed inicial) ou so os cadastrados pelo usuario? Tem implicacao em RN1-RN10 (verificar).
- **Reducer ja tem as acoes** `editarProduto` e `removerProduto` prontas e testadas — falta so a camada de UI + a decisao de politica acima.

### Roteiro restante apos Fase 4

- **Fase 5:** json-server para o catalogo de produtos. Services em `src/services/produtoService.js` (`criar/obter/listar/atualizar/remover` encapsulando `fetch`). `db.json` na raiz versionado. Container Docker ja expoe a porta 3000. Catalogo passa a vir da API; cadastro POSTa para a API.
- **Fase 6:** persistencia local. `src/storage/useLocalStorage.js` (hook generico). `CompraContext` lê/escreve em `localStorage` automaticamente. Garantia de RN8 (reload nao perde dados).
- **Fase 7:** polimento — empty states reais, mensagens de erro de rede, loading states no consumo da API, acessibilidade revisada, ajustes finos de responsividade.
- **Depois:** features de F1-F11 que ainda nao tiverem caido nas fases acima.

Antes de propor codigo novo, ler `docs/PRD.md` (escopo, RN1-RN10, F1-F11), `docs/design-system-reference.md` e validar contra a imagem `docs/CompraSemMedo_DesignSystem_Aprovacao.png`.

## Stack travada

Todas as decisoes abaixo ja estao validadas com o usuario e/ou alinhadas ao exercicio-modelo do professor (`guvon1982/front_2026_1`, branch `develop`, pasta `aulas/aula05` e `aulas/aula06`). Nao reabrir essas decisoes sem motivo explicito:

- **React 19 + Vite 8**
- **react-router v7** — importar de `"react-router"`, **nao** de `"react-router-dom"` (foram unificadas na v7)
- **react-hook-form** para formularios controlados e validacao
- **Context API + useReducer** para estado compartilhado (sem Redux, sem Zustand)
- **CSS externo** (sem CSS-in-JS, sem Material UI ou similar)
- **Fetch API** (sem axios)
- **json-server** como API REST para o catalogo de produtos
- **localStorage** para compra atual, meta e historico de compras finalizadas
- **GitHub Projects** (Kanban) — exigencia do enunciado

## Padroes de codigo (alinhados ao exercicio do professor)

- Organizacao por **paginas** em `src/pages/` (uma por rota).
- Camada de **servicos** em `src/services/`, um arquivo por entidade, exportando `criar / obter / listar / atualizar / remover` que encapsulam `fetch`.
- `BrowserRouter` em `main.jsx`; `<Routes>` em `App.jsx`.
- Estado global em `src/contexts/` com Context + reducer; estado local de componente continua em `useState`.
- Persistencia em `localStorage` deve ser feita por meio de hooks/utilitarios proprios em `src/storage/`, nao espalhada nos componentes.

## Boas praticas obrigatorias

Regras inegociaveis para qualquer codigo escrito neste repositorio:

1. **HTML semantico sempre.** Usar tags corretas para o significado: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<button>` (nunca `<div onClick>`), `<form>`, `<label>` ligado ao `<input>` por `htmlFor`/`id`, `<ul>/<ol>/<li>` para listas, `<h1>`-`<h6>` em hierarquia correta. **Evitar `<div>` quando houver tag semantica adequada.**
2. **Reutilizar componentes existentes.** Antes de criar componente novo, verificar se um dos componentes oficiais ja resolve (Button, Input, Card, ProductItem, ShoppingListItem, BudgetProgress, Header, BottomNavigation, AlertMessage, EmptyState). Criar componente novo so com justificativa clara.
3. **Componente deve ter responsabilidade unica.** Se ele faz duas coisas nao relacionadas, separar.
4. **Props tipadas e documentadas.** Cada componente expoe contrato claro de props com nome auto-explicativo. Sem `props` genericos passando tudo adiante.
5. **Variantes via prop, nao via componente novo.** Ex.: `<Button variant="primary" />` e `<Button variant="ghost" />`, nao `<PrimaryButton />` + `<GhostButton />`.
6. **Acessibilidade basica.** Labels em formularios, `aria-label` quando o texto visivel nao bastar, foco visivel, contraste minimo do reference.md.
7. **Sem CSS inline para estilizacao** (so para valores realmente dinamicos calculados em JS, ex.: largura de uma barra de progresso). Tudo no CSS externo, usando tokens (`var(--color-...)`), nunca hex hardcoded fora do arquivo de tokens.
8. **Codigo legivel antes de codigo esperto.** Nome de variavel diz o que e. Funcao curta. Comentario so quando o porque nao for obvio (o que ela faz o codigo ja diz).
9. **Sem dependencia que nao foi acordada.** Antes de `npm install`, verificar se ja existe solucao com o que esta na stack.
10. **DRY com bom senso.** Repetir 2 vezes esta OK. 3+ vezes ja pede abstracao.

## Validacao manual no navegador

Antes de qualquer commit ou abertura de PR que afete comportamento visivel da aplicacao (nova feature, refatoracao que troca fonte de dados, mudanca de fluxo, formulario, calculo exibido, navegacao), o assistente deve **propor um roteiro de teste manual** para o usuario rodar. Padrao:

1. Garantir que `lint`, `test:run` e `build` estao verdes (dentro do container).
2. Sugerir subir o `npm run dev` no container.
3. Listar passos numerados em portugues, no formato "faca X, espere ver Y", cobrindo o caminho feliz da mudanca + ao menos um caso de borda relevante (estado vazio, valor invalido, meta excedida, etc.).
4. **O usuario executa o teste**; o assistente nao deve tentar dirigir o navegador via tooling.
5. So seguir para commit/PR apos o usuario confirmar que passou. Se aparecer bug, corrigir e oferecer novo roteiro.

Mudancas puramente internas sem efeito visivel (renomear variavel, ajustar comentario, mexer em config) nao precisam de roteiro — basta confirmar que os checks automatizados continuam verdes.

## Escopo (resumo — detalhe em `docs/PRD.md`)

**MVP (F1-F11):** catalogo, cadastro de produto, montar lista de compras com quantidade × preco unitario, subtotal por item, total geral, meta opcional com indicador dentro/fora, remover item, persistencia, responsividade mobile-first, finalizar compra, historico de compras.

**Rotas:** `/` (Inicio), `/cadastro`, `/listagem`. Historico fica como **aba dentro de `/listagem`**, nao em rota separada.

**Modelo "uma compra ativa por vez + historico de compras finalizadas"** — esta e a Opcao B decidida. A evolucao para **multiplas listas simultaneas nomeadas** (Opcao C) e roadmap pos-MVP (Versao 1.5) e nao deve ser implementada agora; o modelo de dados deve, porem, ser desenhado de forma que essa migracao seja possivel sem reescrever o estado.

**Fora do MVP:** OCR de etiqueta, reconhecimento por foto, graficos, multiusuario, backend proprio, MySQL.

## Convencoes de produto

- **Mobile first** sempre — comecar CSS pelo viewport pequeno, nao deixar responsividade para o final.
- Indicador de meta: verde quando `total <= meta`, vermelho quando `total > meta` mostrando o excedido.
- Atualizar pagina ou fechar navegador **nao pode** apagar dados (garantido por localStorage).
- Compras no historico sao **imutaveis** no MVP.

## Comandos do projeto

Todos os comandos `npm` devem rodar **dentro do container Docker** apos a Fase 1.5 estar concluida:

```bash
# Subir/derrubar ambiente
docker compose up -d
docker compose down

# Status
docker compose ps

# Rodar comandos npm dentro do container
docker compose exec app npm install
docker compose exec app npm run dev          # http://localhost:5173
docker compose exec app npm run build
docker compose exec app npm run preview      # http://localhost:4173
docker compose exec app npm run lint
docker compose exec app npm test             # watch
docker compose exec app npm run test:run     # single run (CI)
docker compose exec app npm run test:ui      # UI no navegador
docker compose exec app npm run test:coverage

# Shell dentro do container
docker compose exec app bash
```

O json-server (a entrar em proxima feature) rodara na porta 3000, tambem dentro do container. URL base esperada nos services: `http://localhost:3000/<entidade>`.

**Sem Docker (fallback):** se o container nao estiver disponivel, os mesmos scripts npm rodam direto no Windows (`npm run dev`, etc.), exigindo Node 22+ local.

## Divisao de responsabilidades entre assistentes (combinada com o usuario)

O usuario trabalha com dois assistentes em papeis complementares:

- **Codex:** planejamento, arquitetura, implementacao, explicacao tecnica, ajustes de feedback.
- **Claude Code (este):** revisao tecnica externa — bugs, riscos, regressoes, legibilidade, lacunas de teste, questionamento de decisoes.

Ao revisar codigo neste repositorio, priorize:

1. Aderencia ao PRD (especialmente RN1-RN10 e CS1-CS7).
2. Consistencia com o padrao do exercicio-modelo (services, rotas, react-hook-form).
3. Responsividade mobile-first real, nao apenas declarada.
4. Limites de escopo — sinalizar quando algo estiver virando Opcao C ou stretch goal disfarcado.

## Identidade visual (TRAVADA)

O projeto se chama **Compra Sem Medo**. Conceito: *"Sua compra sob controle, sem susto no caixa."*

**O Design System ja foi aprovado pelo usuario.** Qualquer codigo, componente, mockup ou alteracao visual nova **deve seguir**:

- `docs/design-system-reference.md` — tokens (cores em hex, fonte Inter, lista de componentes oficiais).
- `docs/CompraSemMedo_DesignSystem_Aprovacao.png` — referencia visual aprovada (logo, paleta, tipografia, exemplos de telas).

Nao improvisar paleta, fonte ou estilo. Nao introduzir gradientes, glassmorphism, sombras coloridas exageradas ou outros padroes "cara de IA". Qualquer divergencia precisa de aprovacao explicita do usuario antes.

Componentes oficiais do app: **Button, Input, Card, ProductItem, ShoppingListItem, BudgetProgress, Header, BottomNavigation, AlertMessage, EmptyState**. Componentes `PriceTrackerCard` e telas de "Evolucao de Precos" / "Comparacao de Precos" aparecem na imagem de referencia mas estao **fora do MVP** (stretch S1 / roadmap V3).

## Documentos relevantes

- `docs/PRD.md` — escopo, regras de negocio, criterios de sucesso, restricoes.
- `docs/design-system-reference.md` — tokens e regras visuais aprovadas.
- `docs/CompraSemMedo_DesignSystem_Aprovacao.png` — referencia visual aprovada.
- `RESUMO_PARA_CLAUDE_CODE.md` — historico de contexto inicial (anterior ao PRD); util para entender o porque das decisoes.
- `docs/SDD.md` — ainda nao escrito; sera o proximo documento (arquitetura, estrutura de pastas, modelo de dados, contratos de API).

## Referencia externa

Exercicio-modelo do professor: `guvon1982/front_2026_1`, branch `develop`, especialmente `aulas/aula05` (json-server + db.json + cliente.js) e `aulas/aula06` (projeto Vite com React Router, react-hook-form e camada de services). Use como referencia de estilo e padrao esperado pelo professor.
