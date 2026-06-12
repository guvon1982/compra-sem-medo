# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual do projeto

Projeto final de Front-End (IESB, 5o semestre). Desenvolvimento **individual** por `guvon1982`.

**Repositorio no GitHub:** https://github.com/guvon1982/compra-sem-medo (publico).
**Kanban (GitHub Projects):** https://github.com/users/guvon1982/projects/2 (publico). Colunas: `Backlog` → `To do` → `In progress` → `In review` → `Done`. Cards de feature linkam para os PRs reais. Criado em 2026-06-11 com 12 PRs retroativos em `Done` + 2 limitacoes conhecidas em `Backlog` + 1 placeholder em `To do`.
**Branch padrao:** `develop`. **Branch atual de trabalho:** sem feature ativa (CRUD de produtos completo via PRs #17 + #19 em 2026-06-10). Proxima feature: ainda nao definida — ver "Proxima fase" abaixo.

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
- **PR #6 mergeado em `develop` (2026-06-05):** Fase 4 completa — Context API + reducers + ajustes pos-validacao.
  - **Contextos:** `src/contexts/CatalogoContext.jsx` (produtos) e `src/contexts/CompraContext.jsx` (compraAtual, meta, historicoCompras), cada um com reducer puro separado (`*Reducer.js`) e a "cola" React (`*Context.jsx`). Providers em `main.jsx` na ordem **Catalogo > Compra** (compra referencia produtos por id).
  - **Paginas refatoradas:** Home, Cadastro e Listagem consomem via `useCatalogo`/`useCompra`. Cadastro persiste no catalogo de verdade (acao `adicionarProduto`); Home reflete a compra real; Listagem deixa de manter copia local do estado e mantem apenas UI state (aba ativa, busca, flags de modal).
  - **UX:** apos salvar produto, alerta de sucesso ganha botao "Ver no catalogo" que abre Listagem direto na aba Catalogo via `location.state.aba` do `react-router`.
  - **Fix bonus:** `parsePreco` extraida para `src/utils/currency.js` com heuristica que aceita `9,90`, `9.90`, `1.234,56`, `1234.56` etc. — resolve bug onde `9.90` virava 990.
  - **Testes:** subiu de 3 para 33 (13 dos reducers + 17 de `currency` + 3 smoke do App).
- **PR #8 mergeado em `develop` (2026-06-09):** Fase 5 completa — catalogo via API REST e migracao de modelo para pt-BR.
  - **Infra json-server:** `db.json` na raiz com seed de 10 produtos; `json-server` v1.0.0-beta.15 como devDependency; servico `api` separado no `docker-compose.yml` rodando em `localhost:3000`. Script `npm run api` para uso manual.
  - **Service:** `src/services/produtoService.js` segue padrao do professor (aula06) — 5 funcoes `criar/obter/listar/atualizar/remover` com `try/catch` que devolve `{ message: "Deu ruim! ..." }` em erro. Helper interno `mensagemErro` evita o `undefined-` quando o fetch lanca `TypeError` sem `error.code`.
  - **Modelo migrado para pt-BR:** `name`→`nome`, `category`→`categoria`, `unit`→`unidade`, `price`→`preco`. Entrada da compra: `quantity`→`quantidade`. Refator atinge `mock.js`, reducers + testes, componentes (`ProductItem`, `ShoppingListItem`) e as 3 paginas. Coerencia fim a fim em portugues.
  - **CatalogoContext** ganha state `{ produtos, carregando, erro }` e acoes async. `useEffect` no mount chama `listar()` com flag de cancelamento; `adicionarProduto`/`editarProduto`/`removerProduto` chamam o service antes de despachar. `id` agora gerado pelo json-server (string aleatoria).
  - **UI states** de carregamento e erro em Home/Listagem aba Catalogo/Cadastro: alerta vermelho em erro de rede, empty state "Carregando catalogo..." durante load, botao "Salvando..." disabled durante envio.
  - **Testes:** subiu de 33 para 36 (`catalogoReducer.test.js` reescrito para novo state shape; `App.test.jsx` usa `vi.mock` do `produtoService` para nao bater na rede).
- **PR #11 mergeado em `develop` (2026-06-10):** Fase 6 completa — persistencia local + UI da meta de gasto.
  - **Persistencia (RN8):** `src/storage/useLocalStorage.js` cria hook `useLocalStorage` (substitui `useState` com sincronizacao automatica) e helper puro `lerDoStorage` (sem estado React, usado no lazy initializer do `useReducer`). `CompraContext` usa `lerDoStorage` para iniciar e `useEffect` para salvar a cada mudanca de estado. Chave: `csm:estado-compra` (persiste `compraAtual`, `meta` e `historicoCompras` juntos). Catalogo continua persistindo via json-server (db.json) — separacao mantida.
  - **UI da meta (F6):** `BudgetProgress` ganha botao "Editar" ao lado de "Meta R$ X" quando ja existe meta (prop `onSetBudget`). Formulario inline na `Listagem` (aba Minha compra/Catalogo) com `Input` de `inputMode="decimal"`, validacao via `parsePreco` (rejeita NaN e valores <= 0 conforme RN5), botoes Confirmar/Sem meta/Cancelar. "Sem meta" so aparece quando ha meta a remover.
  - **Validacao manual:** confirmados todos os cenarios — compra, meta e historico sobrevivem ao F5; definir/editar/remover meta funciona; validacao bloqueia entrada invalida; chave `csm:estado-compra` aparece no DevTools > Application > Local Storage.
  - **Testes:** 36/36 continuam passando (jsdom simula localStorage vazio nos testes, entao o lazy initializer cai no `estadoInicialCompra` do mock — comportamento identico ao anterior).
- **PR #13 mergeado em `develop` (2026-06-10):** Fase 7 PR A — mensagens de erro de rede amigaveis.
  - **Service:** `produtoService.js` detecta `TypeError` (caso classico de fetch sem alcancar a API) e devolve **"Sem conexao com a API. Verifique se o servidor esta no ar."** Fallback generico tambem em portugues, sem "Deu ruim!".
  - **Telas:** Home e Listagem (aba Catalogo) usam titulo "Nao foi possivel carregar o catalogo" e mostram a mensagem do service direta (eliminado o pedaco que repetia "Confira se o json-server esta no ar na porta 3000"). Cadastro com fallback mais natural.
  - **Context:** `CatalogoContext.removerProduto` checava `^Deu ruim!` via regex — trocado por `message && !id`, equivalente e robusto a mudancas de string.
  - **Testes:** novo `produtoService.test.js` com 5 testes que mockam `fetch` global e cobrem TypeError, erro generico e sucesso. Total: 36 -> 41.
- **PR #14 mergeado em `develop` (2026-06-10):** Fase 7 PR B — validacao do estado salvo + aviso ao usuario (PRD risco "localStorage corromper estado").
  - **Validacao:** `compraReducer.js` exporta `validarEstadoCompra(obj)` que confere shape minimo (`compraAtual` array de `{id:string, quantidade:number>0}`, `meta` null|number>0, `historicoCompras` array).
  - **Carregamento resiliente:** funcao pura `carregarEstadoInicial` em `src/contexts/carregarEstadoInicial.js` (arquivo separado por causa do Fast Refresh: react-refresh/only-export-components nao deixa misturar export de componente com export de funcao). Distingue 3 casos: chave inexistente -> seed sem aviso; JSON quebrado -> seed COM aviso; shape invalido -> seed COM aviso.
  - **Bug encontrado no proprio teste manual:** primeira versao usava `lerDoStorage(chave, null)` que devolvia `null` tanto para "chave inexistente" quanto para "JSON quebrado" — entao o caminho de erro nao era detectado. Reescrita para ler `localStorage.getItem` direto e separar `null` de `JSON.parse` falhando.
  - **UI:** `CompraContext` expoe `erroStorage` + `descartarErroStorage`. Home mostra `AlertMessage` variant `alert` com botao de fechar quando `erroStorage` for verdadeiro.
  - **Testes:** 8 testes da validacao em `compraReducer.test.js` + 5 testes do `carregarEstadoInicial` em `carregarEstadoInicial.test.js` (mocka localStorage com `beforeEach clear`). Total: 41 -> 54.
- **PR #15 mergeado em `develop` (2026-06-10):** Fase 7 PR C — fechamento + a11y minimo. Apos auditoria curta, descartamos o PR C dedicado de acessibilidade porque o Design System ja cobriu `:focus-visible` global, `aria-label` em botoes so-icone, landmarks (`<main>`, `<header>`, `<nav>`), `role="dialog" + aria-modal` no modal e `role="tab" + aria-selected` nas abas.
  - **Fix 1:** Home nao tinha `<h1>` (o Header usa Logo quando nao tem `title`). Adicionado `<h1 class="csm-sr-only">Compra Sem Medo</h1>` + utilitario `.csm-sr-only` em `base.css` (esconde visualmente mas mantem para leitor de tela).
  - **Fix 2:** modal de finalizar nao movia foco para dentro. Adicionado `useRef`+`useEffect` na Listagem: ao abrir, foco vai para "Sim, finalizar"; ao fechar (apos ter sido aberto), volta para "Finalizar compra". `confirmarJaAbriu` evita focar na 1a render. React 19 trata `ref` como prop normal — Button passa via `{...rest}`.
  - **Docs:** este CLAUDE.md atualizado fecha a Fase 7.
- **PR #17 mergeado em `develop` (2026-06-10):** PR D1 do CRUD — edicao de produto via UI.
  - **Rota nova `/cadastro/:id`:** aponta para a mesma pagina `<Cadastro />`; `useParams()` decide modo "criar" vs "editar". Espelha o padrao do professor (aula06 `Formulario.jsx`).
  - **Pre-preenchimento via `produtoService.obter()`:** chamado no `useEffect` da pagina; flag `cancelado` evita atualizar estado se desmontar antes da resposta.
  - **Estados explicitos:** `carregando` (EmptyState "Carregando produto..."), `naoEncontrado` (EmptyState com link "Ver catalogo" — cobre deep-link com id invalido) e `erroEnvio` (AlertMessage). UI inteira adapta texto: "Editar produto"/"Novo produto", "Salvar alteracoes"/"Salvar produto", mensagem de sucesso, e voltar/cancelar vai para `/listagem` (em vez de `/`).
  - **`ProductItem` com prop opcional `onEdit`:** quando passada, renderiza text-link verde-escuro "Editar" debaixo de "categoria · unidade". Listagem passa `onEdit={() => navigate(\`/cadastro/${p.id}\`)}` na aba Catalogo.
  - **Em modo edicao o form nao limpa apos salvar** (diferente de criar) — usuario pode continuar ajustando.
  - **Testes:** novo teste em `App.test.jsx` cobre a rota `/cadastro/:id`. Total: 54 -> 55.
  - **Validacao manual:** 10 passos confirmados (caminho feliz + cancelar + voltar + validacao + deep-link invalido + API offline + criar nao regrediu).
- **PR #19 mergeado em `develop` (2026-06-10):** PR D2 do CRUD — exclusao de produto via UI. **CRUD do catalogo agora completo (C, R, U, D).**
  - **Botao "Excluir produto" em "Zona de risco"** no rodape do form em modo edicao. Usa `Button` `variant="danger"` que ja existia no DS (laranja-alerta — paleta nao tem vermelho de proposito). Separado visualmente com border-top + label uppercase pequena.
  - **Politica de orfao (bloqueio inline):** antes do modal, checa `compraAtual.some(e => e.id === id)`. Se positivo, mostra `AlertMessage` variant=alert no topo do form com link "Ver minha compra" (`navigate("/listagem", { state: { aba: "compra" } })`). Modal nem abre. Historico nao e afetado porque guarda so agregados sem IDs.
  - **Modal de confirmacao** so abre quando exclusao e viavel. Foco no botao destrutivo ao abrir, volta ao botao "Excluir produto" ao fechar — mesmo padrao do modal de "Finalizar compra" do PR #15.
  - **Erro de rede:** se `removerProduto` lanca, modal nao fecha; `AlertMessage` variant=error aparece dentro do proprio modal com mensagem do service. Apos sucesso, navega para `/listagem` aba Catalogo.
  - **Fix de bug pre-existente:** `#root` ganha `position: relative`. Sem isso, modais com `position: absolute; inset: 0` resolviam contra a viewport e escapavam do shell de 480px no desktop. Beneficia tambem o modal de "Finalizar compra" da Listagem (tinha o mesmo problema desde o PR #4).
  - **Testes:** 1 novo em `App.test.jsx` garantindo que "Zona de risco" nao aparece em modo criar. Total: 55 -> 56.
  - **Validacao manual:** 15 passos confirmados (caminho feliz + bloqueio inline + link "Ver minha compra" + modal cancelar/backdrop/API offline + criar/editar nao regrediram + modal respeita 480px no desktop).

### Limitacoes conhecidas (a serem resolvidas em fases futuras)

- **Compra orfa quando a API esta offline** — identificada no teste manual do PR #13 (2026-06-10). Quando o `json-server` esta fora do ar, a tela `/listagem` aba "Minha compra" mostra "R$ 0,00 / Sua lista esta vazia" mesmo havendo itens persistidos no localStorage. Causa: a Listagem cruza `compraAtual` (IDs) com a lista `produtos` do CatalogoContext via `montarItem`; sem produtos carregados, `.filter(Boolean)` esvazia. **Dados nao sao perdidos** — assim que a API volta, a compra reaparece intacta. Possiveis correcoes: (a) cachear no localStorage um snapshot dos produtos referenciados, (b) mostrar item "Produto indisponivel" com aviso quando o catalogo faltar.
- **Aviso de storage corrompido so na Home** — identificada no PR #14 (2026-06-10). Se o usuario entrar por deep link em `/listagem` com o storage corrompido, perde o aviso "Sua compra anterior nao pode ser recuperada". Cenario raro (rota canonica e a Home), mas vale resolver promovendo o aviso para um componente que monta em qualquer rota (talvez no proprio Provider ou no layout do App).

### Proxima fase

**CRUD do catalogo fechado (2026-06-10, PRs #17 + #19).** Sem proxima feature decidida ainda. Opcoes para conversar com o usuario:

- **Resolver as 2 limitacoes conhecidas** (compra orfa sem API, aviso de storage so na Home). Sao bugs pequenos com correcoes pontuais.
- **Features de F1-F11 do PRD que ainda nao foram cobertas explicitamente** — checar `docs/PRD.md` para identificar se alguma ficou pendente.
- **Stretch goals (S1-S?)** — caso o MVP esteja completo e haja tempo restante.

**Confirmar com o usuario antes de codar.**

### Plano CRUD de produtos (executado em 2026-06-10)

**Status:** ✅ **CRUD completo.** PR D1 mergeado via PR #17 (editar). PR D2 mergeado via PR #19 (excluir). Decisoes do plano foram aprovadas e seguidas. Esta secao fica como historico — pode ser removida em uma futura limpeza do CLAUDE.md.

**Decisoes aprovadas:**

1. **Onde fica a UI de editar/remover — usar a mesma pagina `Cadastro` para criar E editar**, espelhando o padrao do professor (aula06 `Formulario.jsx`).
   - `/cadastro` → cria produto novo (comportamento atual)
   - `/cadastro/:id` → edita produto existente (pre-preenche via `obter()`)
   - Como o usuario chega na edicao: botao text-link pequeno **"Editar"** em cada `ProductItem` da aba Catalogo (nao polui o layout no mobile).
   - Botao **"Excluir"** mora no rodape do formulario em modo edicao, variante danger, com modal de confirmacao. A propria navegacao ate a tela ja serve como "confirmacao por friccao".
   - Por que essa opcao e nao icones inline no `ProductItem`: formulario tem 4 campos (nome, categoria, unidade, preco) — nao da pra editar inline confortavelmente no mobile; reusar componente reduz codigo; casa com o padrao do professor.

2. **Politica de produto orfao — bloquear remocao se estiver na `compraAtual`.**
   - Historico nao e problema: olhando `compraReducer.js`, `historicoCompras` guarda so agregados `{id, data, total, itens (count), meta}` — **nao armazena IDs de produto**. Remover do catalogo nao afeta historico nenhum. RN10 (historico imutavel) respeitada sem esforco.
   - `compraAtual` e o unico risco: se o usuario tentar remover um produto que ele acabou de adicionar a compra, bloqueamos com mensagem clara: *"Este produto esta na sua compra atual. Remova-o da compra antes de excluir do catalogo."*
   - Cascata foi descartada (anti-padrao: deletar silenciosamente itens do usuario).
   - "Manter como descontinuado" foi descartado (complica modelo com flag extra sem ganho concreto).

3. **Produtos do seed sao editaveis sem distincao** (sim, todos editaveis/removiveis).
   - O `db.json` ja e editavel — `json-server` reescreve a cada PUT/DELETE.
   - Reset volta ao seed via `git restore db.json` (ja documentado em "Workflow do db.json").
   - Flag `isSeed` adicionaria complexidade contra "DRY com bom senso" sem ganho concreto.

**Divisao em PRs (ambos mergeados):**

- ✅ **PR D1 — `feature/produto-editar` (PR #17, 2026-06-10):** rota `/cadastro/:id`, pre-preenchimento via `obter()`, botao "Editar" no `ProductItem`, atualizacao via `editarProduto` do contexto + service.
- ✅ **PR D2 — `feature/produto-remover` (PR #19, 2026-06-10):** botao "Excluir" no formulario em modo edicao + modal de confirmacao + bloqueio inline de orfao em `compraAtual` + fix do modal escapando 480px no desktop.

### Roteiro restante

- **Possiveis proximos passos** (a confirmar com o usuario):
  - Resolver as 2 limitacoes conhecidas pendentes (compra orfa sem API, aviso de storage so na Home).
  - Features de F1-F11 do `docs/PRD.md` que ainda nao tenham sido cobertas.
  - Stretch goals.

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
- **GitHub Projects** (Kanban) — exigencia do enunciado. Board ativo em https://github.com/users/guvon1982/projects/2. **Workflow obrigatorio:** toda feature nova deve ter um card que percorre `Backlog` → `To do` (no inicio da feature) → `In progress` (quando comecar a codar) → `In review` (quando o PR for aberto) → `Done` (apos merge em `develop`). Cards de feature linkam o PR real via `gh project item-add`. Cards de roadmap/limitacao ficam como drafts.

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
docker compose exec app npm run api          # json-server manual em http://localhost:3000

# Shell dentro do container
docker compose exec app bash
```

A partir da Fase 5 o `docker compose up -d` ja sobe **dois** servicos: `app` (Vite) e `api` (json-server na porta 3000, lendo o `db.json` da raiz). URL base esperada no `produtoService`: `http://localhost:3000/<entidade>`.

> **Atencao — Vite NAO sobe sozinho.** O `docker compose up -d` deixa o container `app` rodando ocioso (so `tty:true`). Para a app responder em `localhost:5173`, voce precisa entrar no container e iniciar o Vite manualmente. Duas formas: `docker compose exec -T -d app npm run dev` (background) ou `docker compose exec -it app bash` e dentro do shell rodar `npm run dev`. Sintoma classico do esquecimento: navegador mostra `ERR_EMPTY_RESPONSE` em `localhost:5173`.

**Sem Docker (fallback):** se o container nao estiver disponivel, os mesmos scripts npm rodam direto no Windows (`npm run dev`, etc.), exigindo Node 22+ local.

### Troubleshooting do Docker

**`api` falha com `ports are not available: bind: forbidden by access permissions` na porta 3000** (visto em 2026-06-10): o servico `winnat` do Windows reserva faixas dinamicas de porta para Hyper-V/WSL2 que podem incluir a 3000 mesmo sem aparecer em `netstat` ou em `netsh interface ipv4 show excludedportrange protocol=tcp`. Solucao:

1. **PowerShell como Administrador** (botao direito > "Executar como administrador" — UAC obrigatorio).
2. Rodar:
   ```powershell
   net stop winnat
   net start winnat
   ```
3. Voltar para o terminal normal e rodar `docker compose up -d`. Agora o bind funciona.

Se o usuario nao tiver acesso de admin, fallback: mudar a porta da API para 3001 (editar `docker-compose.yml` + `src/services/produtoService.js`).

### Workflow do `db.json` (importante)

O `db.json` na raiz e **o seed** do catalogo de produtos (10 produtos versionados no git). Quando voce roda a app e cadastra/edita/remove produtos via UI, o **proprio `json-server` reescreve esse arquivo** — entao seu working tree fica "sujo" com os produtos de teste.

**Antes de cada commit**, restaurar o seed:

```bash
git restore db.json
```

Isso descarta as mudancas locais e volta o arquivo para a versao que esta na branch (so os 10 produtos originais). Depois conferir com `git status` que so as alteracoes da feature ficam para commit.

> Se algum dia o seed precisar mudar de verdade (ex.: trocar um produto, adicionar categoria nova), editar `db.json` manualmente e commitar a mudanca — nao deixar o servidor "decidir" o que entra no seed.

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
- `docs/Especificacao_do_Projeto_Final.md` — enunciado oficial do professor (requisitos funcionais, criterios de avaliacao).
- `docs/design-system-reference.md` — tokens e regras visuais aprovadas.
- `docs/CompraSemMedo_DesignSystem_Aprovacao.png` — referencia visual aprovada.
- `RESUMO_PARA_CLAUDE_CODE.md` — historico de contexto inicial (anterior ao PRD); util para entender o porque das decisoes.
- `docs/SDD.md` — ainda nao escrito; sera o proximo documento (arquitetura, estrutura de pastas, modelo de dados, contratos de API).
- **Kanban (GitHub Projects):** https://github.com/users/guvon1982/projects/2 — board publico que reflete o fluxo de desenvolvimento. Ver "Stack travada" para o workflow obrigatorio.

## Referencia externa

Exercicio-modelo do professor: `guvon1982/front_2026_1`, branch `develop`, especialmente `aulas/aula05` (json-server + db.json + cliente.js) e `aulas/aula06` (projeto Vite com React Router, react-hook-form e camada de services). Use como referencia de estilo e padrao esperado pelo professor.
