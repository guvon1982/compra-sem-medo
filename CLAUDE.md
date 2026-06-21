# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Estado atual do projeto

Projeto final de Front-End (IESB, 5o semestre). Desenvolvimento **individual** por `guvon1982`.

**Repositorio no GitHub:** https://github.com/guvon1982/compra-sem-medo (publico).
**Kanban (GitHub Projects):** https://github.com/users/guvon1982/projects/2 (publico). Colunas: `Backlog` → `To do` → `In progress` → `In review` → `Done`. Cards de feature linkam para os PRs reais. Criado em 2026-06-11 com 12 PRs retroativos em `Done` + 2 limitacoes conhecidas em `Backlog` + 1 placeholder em `To do`.
**Branch padrao:** `develop`. **Branch atual de trabalho:** sem feature ativa. **Estado atual (2026-06-21):** MVP F1-F11 do PRD fechado, **4 de 4 limitacoes conhecidas resolvidas** via PRs de polimento (#26, #27), **2 de 4 stretch goals do PRD entregues** (S2 editar produto no PR #17, S4 excluir compra do historico no PR #28). **Aguardando aprovacao do professor** para promover `develop` para `main`. Stretch goals S1 (historico de precos por produto) e S3 (filtrar/buscar produto, parcialmente coberto pela busca textual ja existente) ficam como roadmap pos-entrega.

**REGRA ESPECIFICA DESTE PROJETO — release `develop -> main`:** diferente do workflow padrao do CLAUDE global (onde `main` recebe `develop` quando o usuario decide), aqui o gatilho e **externo**: o professor avalia a `develop` e, **somente apos a aprovacao explicita do usuario** ("o professor aprovou, pode promover"), a release acontece. Antes disso, **NAO abrir PR de `develop -> main` por iniciativa propria**. PR #30 foi aberto prematuramente em 2026-06-21 e fechado pelo mesmo motivo — ja existe um card "Release v1.0 — promove develop para main" no `Backlog` do Kanban esperando o gatilho.

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
- **PR #22 mergeado em `develop` (2026-06-11):** docs do Kanban + enunciado oficial versionado. Codigo nao mudou.
  - **CLAUDE.md** ganha 3 entradas: link do board publico em https://github.com/users/guvon1982/projects/2, workflow Backlog → To do → In progress → In review → Done na "Stack travada", e referencia ao board em "Documentos relevantes".
  - **`docs/Especificacao_do_Projeto_Final.md`** versionado como referencia permanente do enunciado oficial do professor (estava untracked).
  - **Kanban populado retroativamente:** 12 PRs de feature/infra em Done (1, 2, 3, 4, 6, 8, 11, 13, 14, 15, 17, 19), 2 limitacoes conhecidas em Backlog, 1 placeholder em To do. Views configuradas: **Kanban** (Board layout) e **Tabela** (Table layout). Board e publico.
  - **Primeiro card a percorrer o workflow novo:** o proprio PR #22 (criado em Backlog → linkado em In review → movido para Done apos merge).
- **PR #23 mergeado em `develop` (2026-06-12):** docs dos comandos do Kanban. Codigo nao mudou. Adiciona subsecao "Comandos do Kanban (GitHub Projects)" em "Comandos do projeto" com IDs do board travados e receitas de CLI para nao re-descobrir via API em cada sessao nova. Documenta o workflow obrigatorio por feature passo a passo.
- **PR #24 mergeado em `develop` (2026-06-20):** F11 do PRD — **detalhes da compra no historico**. Fecha o ultimo gap do MVP F1-F11.
  - **Modelo de dados migrado:** `compraReducer.finalizarCompra` agora salva `itens` como **array de snapshots** (`{ id, nome, categoria, unidade, preco, quantidade }`) em vez de apenas a contagem. Justificativa: RN10 do PRD (historico imutavel) — snapshot garante registro fiel mesmo apos editar/excluir produto do catalogo.
  - **Retrocompat com formato legado:** `validarEstadoCompra` aceita `itens` como `number` (formato antigo) ou `array` (formato novo) — nenhum dado existente perdido nem dispara aviso de "storage corrompido". Na UI, helpers `temDetalhes` e `contarItens` em `Listagem/index.jsx` lidam com os dois formatos; compra antiga abre detalhe com `AlertMessage` "Detalhes nao disponiveis".
  - **UI inline na propria aba Historico** (sem rota nova, sem modal). Cards do historico viraram clicaveis (`Card as="button" interactive`). Decisao alinhada ao mobile-first: modal de lista longa ficaria apertado.
  - **`ShoppingListItem` ganha prop `readOnly`** (variante via prop conforme item 5 das Boas Praticas). Em readOnly, esconde stepper +/− e botao remover; mostra "Qtd: N". Usado no detalhe do historico para refletir RN10 (historico imutavel).
  - **Novo padrao de a11y `data-focus-injetado` (ver "Padroes de codigo" abaixo):** introduzido para resolver bug onde `.focus()` chamado de dentro de handler de clique de mouse nao mostrava o anel azul (`:focus-visible` so dispara em interacao de teclado). Aplicado no detalhe do historico e tambem retroativamente no modal de finalizar compra para consistencia.
  - **Testes:** 56 -> 57 (teste de `finalizarCompra` reescrito para novo shape; novo teste de retrocompat do validador aceitando ambos formatos).
  - **Validacao manual:** 20 passos confirmados — caminho feliz com nova compra, retrocompat com compra antiga, estados de borda (historico vazio, sem meta), nao regressoes do CRUD.
- **PR #25 mergeado em `develop` (2026-06-20):** docs do PR #24. Registra F11 completo, adiciona 2 novas limitacoes conhecidas (meta-reset RN9, URL persistente), nota sobre decisao de nao usar Milestones e novo padrao a11y `data-focus-injetado`.
- **PR #26 mergeado em `develop` (2026-06-21):** **conformidade PRD** — fecha 2 das 4 limitacoes conhecidas.
  - **Fix RN9:** `compraReducer.finalizarCompra` agora zera `meta: null` alem da compraAtual. O registro do historico continua salvando a meta que estava ativa (preserva RN10).
  - **Aviso de storage em qualquer rota:** novo `src/components/Layout/` envolve as 4 rotas via `<Outlet />` do react-router v7. AlertMessage de `erroStorage` saiu da Home e mora no Layout, com posicionamento `position: absolute` no `#root` para nao mexer no flex layout do `.csm-screen` (evita risco de regressao de altura). Banner sobrepoe brevemente o Header ate o usuario fechar pelo X.
- **PR #27 mergeado em `develop` (2026-06-21):** **robustez do estado** — fecha as outras 2 limitacoes + bug bonus.
  - **URL persistente:** `useSearchParams` substitui `useState` para aba ativa (`?aba=catalogo|historico`) e compra selecionada no detalhe (`?compra=h-XXX`). F5 mantem usuario onde estava, deep-link funciona, botoes voltar/avancar do browser navegam entre abas. Fluxo antigo (`location.state.aba` do Cadastro) continua funcionando — promovido para URL no primeiro mount via `useEffect` com `replace: true`.
  - **Item "Produto indisponivel" sem API:** `montarItem` devolve placeholder em vez de null quando o produto nao esta no catalogo. `.filter(Boolean)` removido. `ShoppingListItem` ganha prop `indisponivel` (italico cinza no nome, subtotal vira "—", "Sem informacoes do catalogo" no lugar do preco). AlertMessage no topo da aba informa quantos itens estao indisponiveis. Total ignora indisponiveis (preco desconhecido = 0).
  - **Bug bonus — busca sem acento:** descoberto no teste manual. `normalizarBusca()` usa `String.normalize("NFD")` + regex para remover acentos antes de comparar. "feijao" agora encontra "Feijão", "acucar" encontra "Açúcar". UX padrao no Brasil para celular.
- **PR #28 mergeado em `develop` (2026-06-21):** **stretch goal S4 + UX bonus**.
  - **S4 do PRD — excluir compra do historico:** nova action `excluirCompraHistorico({id})` no reducer (idempotente). UI: secao "Zona de risco" no detalhe da compra com botao danger + modal de confirmacao (mesmo padrao dos PRs #15 e #19 para foco). Apos confirmar, limpa `?compra=` da URL e volta para a lista. Disponivel tambem para compras antigas (formato legado). Atualiza a leitura pratica da RN10: registros continuam imutaveis para edicao, mas o stretch S4 libera exclusao explicita pelo usuario.
  - **Bonus — botao X na busca:** `Input` ganha prop opcional `onClear`. Quando passada E o campo tem valor, renderiza botao "X" dentro do campo (canto direito). Padrao de UX de apps mobile. Descoberto no teste manual do S4. Acessivel — aria-label e Tab funciona.
  - **Testes:** 57 -> 59 (+2 testes do reducer: exclui pelo id, ignora id inexistente).
- **PR #29 mergeado em `develop` (2026-06-21):** docs dos PRs #26, #27, #28. Codigo nao mudou. Atualiza "Branch atual de trabalho" (4/4 limitacoes resolvidas + S2 + S4 entregues), zera a secao "Limitacoes conhecidas" e aponta release para `main` como proximo passo (depois corrigido pelo PR #31 — release requer aprovacao do professor).
- **PR #30 FECHADO sem merge (2026-06-21):** tentativa prematura de release `develop -> main` aberta por iniciativa do assistente. Fechado apos o usuario explicar que a release so acontece apos aprovacao explicita do professor (regra desconhecida ate entao). Card "Release v1.0" voltou para o `Backlog` aguardando o gatilho. Regra documentada em destaque no inicio deste arquivo (secao "Estado atual do projeto") e na memoria do projeto (`memory/release_so_apos_aprovacao_professor.md`).
- **PR #31 mergeado em `develop` (2026-06-21):** docs da **regra de release especifica do projeto**. Codigo nao mudou. Documenta no CLAUDE.md que a release `develop -> main` requer aprovacao explicita do professor — diverge do workflow padrao do CLAUDE global. Tambem salva a regra como memoria do projeto para sessoes futuras carregarem automaticamente.
- **PR #32 mergeado em `develop` (2026-06-21):** **ultimo gap real do PRD (RN2)** descoberto na auditoria pre-entrega + 2 fixes de UX no catalogo.
  - **RN2 do PRD — nome unico no catalogo:** novo helper puro `src/utils/catalogo.js` com `temNomeDuplicado(nome, produtos, idAtual)` que compara case-insensitive, ignorando espacos nas pontas E acentos (leitura estrita PT-BR: "Acucar Uniao" e "Açúcar União" sao o mesmo produto). Em modo edicao, ignora o proprio produto (compara IDs). `Cadastro.validar()` chama o helper e mostra erro inline. Antes do PR, era possivel cadastrar "Arroz Tio João 5kg" duplicado com qualquer combinacao de caixa/acento/espaco.
  - **Helper `normalizar()` compartilhado:** extraido do `normalizarBusca` local da Listagem (PR #27) para o novo `src/utils/catalogo.js`. Agora um unico lugar controla o que conta como "igual" — usado tanto pela busca textual quanto pela validacao de unicidade do `temNomeDuplicado`. Listagem refatorada para importar o helper, eliminando duplicacao (regra DRY do CLAUDE.md).
  - **Ordem alfabetica no catalogo:** aba Catalogo da Listagem ordena cada grupo de categoria com `.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))`. O `localeCompare("pt-BR")` trata acentos corretamente (ç entre c e d, á entre a e b). Antes, produtos novos iam para o fim da lista (ordem de insercao da API).
  - **Testes:** 59 -> 71 (+12: 7 do helper `temNomeDuplicado`/`normalizar`, + ajustes nos existentes).
  - **Licao aprendida (importante para futuros projetos):** auditoria pre-entrega contra RN1-RN10 do PRD revelou que a RN2 nunca havia sido implementada — o codigo passava em todas as outras validacoes mas violava silenciosamente uma regra de negocio. Boa pratica: **antes de declarar "pronto", percorrer EXPLICITAMENTE cada regra do PRD e cada criterio do avaliador**, checando se ha codigo real cumprindo aquilo. Lint/testes/build verdes nao garantem conformidade — eles garantem que o codigo escrito funciona, mas nao que tudo que devia ser escrito foi escrito.

### Limitacoes conhecidas (a serem resolvidas em fases futuras)

**Todas as 4 limitacoes conhecidas anteriores foram resolvidas nos PRs #26 e #27.** Sem novas limitacoes registradas neste momento.

### Proxima fase

**Projeto consolidado em 2026-06-21 — pronto para apresentacao do professor.** Estado final:

- ✅ MVP F1-F11 do PRD
- ✅ **RN1-RN10 todas implementadas** (RN2 era o ultimo gap, fechado no PR #32)
- ✅ 4 de 4 limitacoes conhecidas resolvidas (PRs #26, #27)
- ✅ Stretch goals S2 (editar produto, PR #17) e S4 (excluir compra, PR #28)
- ✅ **71 testes automatizados verdes** (lint + test + build)
- ✅ 5 criterios da rubrica do professor cobertos (organizacao, tecnica, validacao, responsividade, versionamento)
- ✅ 31 PRs mergeados na `develop` com historico narrativo (sem squash gigante — CS7 do PRD atendido)

**Proximo passo:** **aguardar aprovacao do professor** (ele avalia a `develop`). Quando o usuario disser explicitamente "professor aprovou, pode promover", abrimos o PR `develop -> main`. **NAO fazer por iniciativa propria** — ver regra de release no topo deste arquivo.

**Roadmap pos-release** (caso o usuario queira continuar evoluindo apos a entrega):
- **S1 do PRD** — historico de precos por produto (derivar do `historicoCompras`, que ja tem snapshot completo desde PR #24). Tela ou secao nova, ~80-120 linhas.
- **S3 do PRD** — filtro por categoria no Catalogo (busca textual ja existe com tolerancia a acentos no PR #27). Filtro por categoria seria a extensao natural.
- **Versao 1.5 do PRD** — multiplas listas simultaneas nomeadas (ver secao "Roadmap pos-entrega" do PRD).

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

- **Imediato:** **aguardar aprovacao do professor** (ele avalia a `develop`). Quando aprovado, o usuario confirma e abrimos o PR `develop -> main` (ver regra acima — nao fazer por iniciativa propria).
- **Pos-release** (caso o usuario queira continuar):
  - Stretch S1 do PRD — historico de precos por produto.
  - Stretch S3 do PRD — filtro por categoria no Catalogo (busca textual ja existe).
  - Versao 1.5 do PRD — multiplas listas simultaneas nomeadas.

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
- **Sem GitHub Milestones nem GitHub Issues** (avaliados e descartados em 2026-06-20). Milestone faz sentido em time grande com varias releases e muitas issues simultaneas — para projeto individual com fluxo "1 feature = 1 branch = 1 PR" e Kanban ja dando visibilidade, vira manutencao extra sem ganho. Enunciado pede Kanban (CS6), nao menciona Milestone. **Fluxo de tracking unico: Kanban + PR + commits.**

## Padroes de codigo (alinhados ao exercicio do professor)

- Organizacao por **paginas** em `src/pages/` (uma por rota).
- Camada de **servicos** em `src/services/`, um arquivo por entidade, exportando `criar / obter / listar / atualizar / remover` que encapsulam `fetch`.
- `BrowserRouter` em `main.jsx`; `<Routes>` em `App.jsx`.
- Estado global em `src/contexts/` com Context + reducer; estado local de componente continua em `useState`.
- Persistencia em `localStorage` deve ser feita por meio de hooks/utilitarios proprios em `src/storage/`, nao espalhada nos componentes.
- **Foco programatico apos clique de mouse:** quando chamar `.focus()` de dentro de um handler de clique (ex.: devolver foco ao card de origem ao fechar um detalhe/modal), usar o helper `focarVisivel` (`Listagem/index.jsx`) que adiciona `data-focus-injetado` no elemento. A regra em `src/styles/base.css` faz com que o anel azul do `:focus-visible` apareca nesse caso — sem o atributo, Chrome/Edge escondem o anel porque tratam o foco como "originado de mouse". Hoje o helper esta inline na Listagem; se outra pagina precisar, vale extrair para `src/utils/`.
- **Comparacao de strings de produto (busca + unicidade):** usar `normalizar(s)` exportado de `src/utils/catalogo.js` — faz NFD + remove acentos + baixa caixa + trim. Garante que busca, unicidade do nome (RN2) e qualquer comparacao futura usem o MESMO criterio. Se a busca encontra dois itens iguais, a validacao de unicidade tambem detecta — sem isso, comportamentos divergem. Usado em `temNomeDuplicado` (mesma file) e na busca do catalogo na Listagem.
- **Ordenacao de strings PT-BR:** usar `array.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))` em vez de comparacao default (que falha com acentos — "Açucar" iria depois de "Z" em ASCII puro). Aplicado na aba Catalogo da Listagem; se aparecer outra lista de strings em PT-BR no projeto, usar o mesmo padrao.

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

### Comandos do Kanban (GitHub Projects)

Board publico em https://github.com/users/guvon1982/projects/2.

**Pre-requisito:** o token do `gh` precisa ter o escopo `project`. Se faltar, rodar uma vez `gh auth refresh -s project` (abre o navegador para autorizar).

**IDs travados do board** (gravados em 2026-06-11, ja confirmados estaveis):

```text
Project number: 2
Owner:          guvon1982
Project ID:     PVT_kwHOC-k1r84BabMk
Status field:   PVTSSF_lAHOC-k1r84BabMkzhVS65s

Option IDs (Status):
  Backlog:     96a238e4
  To do:       6f6b2ac5
  In progress: 8a5775ca
  In review:   00a2c5de
  Done:        faeafac7
```

**Receitas** (rodar do host, fora do container):

```bash
# Listar tudo no board (estado atual; output e grande, usar --limit ou jq)
gh project item-list 2 --owner guvon1982 --format json --limit 30

# Ver os campos do board (se precisar redescobrir IDs por algum motivo)
gh project field-list 2 --owner guvon1982 --format json

# Linkar um PR existente como card no board (retorna o item ID no JSON)
gh project item-add 2 --owner guvon1982 --url https://github.com/guvon1982/compra-sem-medo/pull/<num> --format json

# Criar um draft (ideia, limitacao, roadmap — sem PR ainda)
gh project item-create 2 --owner guvon1982 --title "Titulo curto" --body "Descricao." --format json

# Mover um card para outra coluna (precisa do item ID retornado pelos comandos acima)
gh project item-edit --id <item-id> --field-id PVTSSF_lAHOC-k1r84BabMkzhVS65s --project-id PVT_kwHOC-k1r84BabMk --single-select-option-id <option-id>

# Alterar config do board (publico/privado, descricao) via GraphQL
gh api graphql -f query='mutation { updateProjectV2(input: { projectId: "PVT_kwHOC-k1r84BabMk", public: true }) { projectV2 { public } } }'
```

### Workflow obrigatorio por feature

Toda feature nova (code OU docs significativas) deve ter um card que percorre todas as 5 colunas:

1. **Antes de criar a branch** — criar draft no `Backlog` (`item-create`) ou mover card existente de `Backlog` para `To do`.
2. **Ao comecar a codar** — mover o card para `In progress`.
3. **Ao abrir o PR** — linkar o PR ao card (`item-add` com a URL do PR) e mover para `In review`. Se ja existia draft, criar um item linkado ao PR e remover/aposentar o draft.
4. **Apos merge em `develop`** — mover o card para `Done`.

Hot-fixes documentais minusculas (ex.: corrigir typo no README) podem passar direto pelo Kanban sem card. Use bom senso: se valeu PR separado, vale card separado.

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
