# PRD — Projeto Final de Front-End

## 1. Identificacao

- **Nome do projeto:** Compra Sem Medo
- **Conceito de marca:** "Sua compra sob controle, sem susto no caixa."
- **Disciplina:** Front-End — 5o semestre, IESB
- **Autor:** desenvolvimento individual
- **Tipo de entrega:** projeto final da disciplina
- **Repositorio:** a criar no GitHub
- **Data de referencia:** 2026-06-02

## 2. Problema

Pessoas vao ao supermercado sem lista de compras. Quando tem lista, nao sabem em tempo real quanto a compra esta custando — a unica alternativa hoje e somar mentalmente ou usar a calculadora do celular, o que e lento e atrapalha o fluxo da compra. O resultado e estouro de orcamento, surpresa no caixa e dificuldade de comparar gastos entre compras.

## 3. Publico-alvo

Pessoas que fazem compras de mercado e querem controlar o gasto durante a compra, nao depois. Uso primario no celular, dentro do supermercado, com uma das maos ocupada. Por isso a aplicacao e **mobile first**.

## 4. Objetivos

1. Permitir montar uma lista de compras a partir de um catalogo de produtos.
2. Calcular o total da compra em tempo real conforme o usuario adiciona itens.
3. Avisar se o usuario esta dentro ou fora de uma meta de gasto opcional.
4. Funcionar bem no celular, offline-friendly (dados ficam no navegador).

## 5. Escopo

### 5.1. Funcionalidades obrigatorias (MVP)

| # | Funcionalidade | Descricao |
|---|---|---|
| F1 | Catalogo de produtos | Listagem dos produtos disponiveis, carregada inicialmente de uma API REST externa. |
| F2 | Cadastro de produto | Formulario controlado para adicionar um novo produto ao catalogo, com validacao de campos. |
| F3 | Montar lista de compras | Selecionar produtos do catalogo e adicionar a compra atual com quantidade e preco unitario. |
| F4 | Calculo de subtotal por item | Subtotal = quantidade × preco unitario, atualizado automaticamente. |
| F5 | Calculo de total geral | Soma dos subtotais de todos os itens da compra atual, visivel em tempo real. |
| F6 | Meta de gasto opcional | Usuario pode definir uma meta. App mostra valor gasto, valor restante e indicador visual (dentro/fora). |
| F7 | Remover item da compra | Excluir um item ja adicionado a compra atual. |
| F8 | Persistencia local | Catalogo, compra atual, meta e historico de compras sao mantidos entre sessoes via localStorage. |
| F9 | Responsividade mobile first | Interface utilizavel em telas pequenas, com adaptacao para tablet e desktop. |
| F10 | Finalizar compra | Usuario encerra a compra atual ao sair do mercado. Itens, total, meta e data sao arquivados em `historicoCompras` e a `compraAtual` e zerada para a proxima ida. |
| F11 | Visualizar historico de compras | Tela/aba que lista compras finalizadas com data e total, permitindo abrir os detalhes (itens, subtotais, meta original). |

### 5.2. Funcionalidades desejaveis (stretch goals)

Implementadas apenas se sobrar tempo, sem comprometer o MVP:

- **S1.** Historico de precos por produto: a partir do `historicoCompras`, derivar e exibir a evolucao do preco de cada produto ao longo do tempo em tabela.
- **S2.** Editar produto do catalogo.
- **S3.** Filtrar/buscar produto no catalogo.
- **S4.** Excluir compra do historico.

### 5.3. Fora de escopo (roadmap futuro)

Mencionado para deixar claro que **nao entra** nesta entrega:

- **Multiplas listas simultaneas nomeadas** (ex.: "Compra mensal", "Churrasco", "Mercado da semana") com troca entre elas. Esta e a evolucao planejada **pos-MVP** — o MVP usa o modelo de "uma compra ativa por vez + historico" (ver F10/F11).
- OCR de etiqueta de preco (foto -> valor automatico).
- Reconhecimento de produto por foto.
- Graficos de evolucao de preco.
- Comparacao de precos entre supermercados.
- Login, multiusuario, sincronizacao entre dispositivos.
- Backend proprio e banco de dados (MySQL).

## 6. Regras de negocio

- **RN1.** Preco unitario e quantidade devem ser numeros positivos maiores que zero.
- **RN2.** Nome do produto e obrigatorio e nao pode ser duplicado no catalogo (comparacao case-insensitive, ignorando espacos nas pontas).
- **RN3.** Subtotal de item = `quantidade × precoUnitario`, arredondado a duas casas decimais para exibicao.
- **RN4.** Total da compra = soma dos subtotais de todos os itens da compra atual.
- **RN5.** Meta e opcional. Quando definida, deve ser um numero positivo.
- **RN6.** Indicador de meta:
  - `total <= meta` -> estado "dentro da meta" (verde, `#22C55E`).
  - `total > meta` -> estado "meta excedida" (laranja-alerta, `#F97316`), exibindo o valor excedido.
- **RN7.** Remover um item da compra recalcula o total imediatamente.
- **RN8.** Atualizar a pagina ou fechar o navegador **nao pode** apagar dados (garantido pelo localStorage).
- **RN9.** Finalizar compra so e permitido se houver pelo menos 1 item na `compraAtual`. Ao finalizar, o sistema cria um registro em `historicoCompras` com `{id, data, itens, total, meta}` e zera `compraAtual` e `meta`.
- **RN10.** Compras no historico sao imutaveis no MVP (nao editaveis, nao excluiveis). Exclusao entra como stretch S4.

## 7. Fluxos principais do usuario

### Fluxo 1 — Compra rapida com produtos existentes
1. Usuario abre o app no celular ja dentro do supermercado.
2. (Opcional) Define uma meta de gasto.
3. Vai para a tela de Catalogo, escolhe um produto.
4. Informa quantidade e preco unitario observado na prateleira.
5. Item entra na lista de compras com subtotal calculado.
6. Total e indicador de meta atualizam.
7. Repete para os proximos produtos.

### Fluxo 2 — Cadastrar produto novo
1. Usuario nao encontra o produto no catalogo.
2. Vai para a tela de Cadastro.
3. Preenche nome, categoria e unidade.
4. Sistema valida e adiciona ao catalogo.
5. Usuario volta para a Listagem e ja pode usa-lo na compra.

### Fluxo 3 — Acompanhar meta
1. Usuario define meta de R$ 300.
2. Vai adicionando itens.
3. A cada item, app mostra: total atual, quanto falta para a meta, indicador visual.
4. Se passar da meta, indicador muda para vermelho e mostra o valor excedido.

## 7.1. Diretrizes de design e UI

### Principios

- **Mobile-first real.** Layout pensado primeiro para 360px de largura, depois adaptado para tablet (~768px) e desktop (~1024px+). Nada de "fiz desktop e depois apertei para caber no celular".
- **Minimalismo com impacto visual.** Pouco elemento na tela, hierarquia clara, mas cada elemento bem trabalhado. O "uau" vem da composicao, nao do excesso.
- **Sem "cara de IA".** Evitar explicitamente: gradientes roxo/rosa/azul saturados, glassmorphism, particulas/blobs animados de fundo, sombras coloridas exageradas, ironia de "AI-powered" em badges, ilustracoes genericas estilo isometrico violeta.
- **Legibilidade acima de efeito.** Contraste alto. Texto sempre legivel. Botoes sempre claros. Estado dos elementos (ativo, desabilitado, erro) sempre obvio.
- **Toque generoso.** Areas clicaveis com no minimo 44x44px (padrao de acessibilidade mobile). Espaco entre elementos para nao errar o dedo.

### Linguagem visual

- **Paleta (travada — ver `docs/design-system-reference.md` e `docs/CompraSemMedo_DesignSystem_Aprovacao.png`):**
  - `--color-green-primary: #22C55E` (marca, sucesso, dentro da meta)
  - `--color-green-dark: #15803D` (variante escura)
  - `--color-blue-primary: #2563EB` (acoes, confianca)
  - `--color-blue-light: #0EA5E9` (variante leve)
  - `--color-orange-alert: #F97316` (alertas, meta excedida)
  - `--color-purple-support: #8B5CF6` (apoio opcional)
  - `--color-background: #F8FAFC`
  - `--color-surface: #FFFFFF`
  - `--color-border: #E2E8F0`
  - `--color-text-primary: #0F172A`
  - `--color-text-secondary: #64748B`
- **Tipografia:** **Inter** (Google Fonts). Hierarquia por **tamanho e peso**, nao por cor. Peso 400-500 para corpo, 600-700 para titulos.
- **Espacamento:** sistema de 4px ou 8px (multiplos: 4, 8, 12, 16, 24, 32, 48). Nao usar valores aleatorios.
- **Cantos arredondados:** moderados (4-8px em botoes e cards). Sem cantos super redondos estilo "pilula" em tudo.
- **Sombras:** muito discretas ou ausentes. Preferir bordas finas (1px em cinza claro) para separar elementos quando precisar.
- **Icones:** uma biblioteca consistente (sugestao: **Lucide** ou **Phosphor** — ambas com pacote React, traco fino, neutras). Sem misturar estilos.

### Componentes de alto impacto (onde investir esforco visual)

- **Total da compra:** numero grande, peso alto, posicao fixa visivel (sticky no rodape ou topo da tela de compra). E o "heroi" da interface.
- **Indicador de meta:** transicao visual clara entre "dentro" (verde) e "fora" (vermelho). Animacao sutil ao mudar de estado e bem-vinda.
- **Botao "Finalizar compra":** acao definitiva, merece destaque, com confirmacao antes de executar.
- **Lista de itens da compra:** cada item tem nome, quantidade × preco, subtotal alinhado a direita. Densidade media — nem apertado nem com muito espaco.

### Anti-padroes a evitar

- Telas de "splash" ou onboarding longas no MVP. O usuario chega e ja consegue agir.
- Modais empilhados.
- Texto em ingles misturado com portugues ("Add", "Submit", etc.). **Tudo em portugues.**
- Botoes flutuantes (FAB) sem proposito.
- Carrosseis de produtos. Lista vertical resolve.
- Skeleton loaders extravagantes para listas curtas. Texto simples "Carregando..." resolve.

## 8. Telas (mapa de alto nivel)

Detalhamento de componentes e estados fica no SDD.

| Rota | Tela | Proposito |
|---|---|---|
| `/` | Inicio | Apresentacao do app, resumo da compra atual, atalho para Listagem e Cadastro. |
| `/cadastro` | Cadastro | Formulario para criar produto no catalogo. |
| `/listagem` | Listagem / Compra | Catalogo de produtos + lista da compra atual + meta + total. Inclui acao "Finalizar compra". |

Tres rotas atendem ao requisito minimo do professor (Inicio, Cadastro, Listagem). O **historico de compras (F11)** sera exibido como aba/secao dentro de `/listagem` ou em modal — decisao final no SDD —, sem criar quarta rota, para manter o roteamento enxuto.

## 9. Criterios de sucesso

O projeto e considerado bem entregue quando:

- **CS1.** Todos os 5 criterios de avaliacao do professor estao cobertos com evidencia clara no codigo.
- **CS2.** O app roda localmente com `npm install && npm run dev` sem ajustes manuais.
- **CS3.** Professor consegue: navegar entre as 3 telas, cadastrar um produto, montar uma lista, definir uma meta, ver os totais, fechar e reabrir o navegador, e encontrar os dados ainda la.
- **CS4.** App e utilizavel em tela de 360px de largura sem scroll horizontal.
- **CS5.** Existe pelo menos uma chamada GET visivel na aba Network consumindo API REST externa.
- **CS6.** Kanban no GitHub Projects reflete o que foi feito, em andamento e backlog.
- **CS7.** Historico de commits conta uma historia coerente (nao tudo em um commit gigante).

## 10. Restricoes

- **R1.** Stack obrigatoria: React.
- **R2.** Roteamento via React Router.
- **R3.** CSS externo (sem CSS-in-JS, sem framework UI pesado tipo Material UI).
- **R4.** Consumo obrigatorio de uma API REST.
- **R5.** Entrega via GitHub + GitHub Projects (Kanban).
- **R6.** Desenvolvimento individual.
- **R7.** Sem backend proprio nesta versao.
- **R8.** Persistencia hibrida: **json-server** para o catalogo de produtos (consumo REST exigido pelo enunciado) e **localStorage** para o estado da compra atual, meta e historico de compras finalizadas.
- **R9.** Formularios devem seguir o padrao usado em aula (react-hook-form), com validacao explicita das regras de negocio.

## 11. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
|---|---|---|
| Subestimar tempo de CSS responsivo | Atraso na entrega | Comecar mobile-first desde o primeiro componente, nao deixar para o fim. |
| API publica escolhida ficar fora do ar | Perde requisito | Usar `json-server` local como fallback documentado no README. |
| localStorage corromper estado | App quebra ao abrir | Validar formato ao carregar; se invalido, resetar com aviso ao usuario. |
| Escopo crescer durante implementacao | Nao terminar MVP | Stretch goals so depois de F1-F9 todos verdes. |

## 12. Stack tecnica (resumo — detalhe no SDD)

- React 19 + **Vite** (confirmado: stack usada em sala de aula)
- **react-router v7** — import de `"react-router"` (sem `-dom`), padrao usado em aula
- **react-hook-form** para formularios controlados e validacao — biblioteca utilizada pelo professor no exercicio-modelo
- **Context API + useReducer** (estado compartilhado) — decisao confirmada. Justificativa: cobre os 5 pedacos de estado do app (produtos, compra atual, meta, historico, decisoes derivadas) com solucao nativa do React, sem dependencia externa, evitando o prop drilling que ficaria custoso de manter dado a arvore de componentes (Header + 3 rotas + sub-componentes por rota). O exercicio-modelo nao usa Context porque manipula apenas uma entidade isolada por pagina; nosso projeto tem estado realmente compartilhado entre telas (total e meta visiveis em Header, Inicio e Listagem), o que justifica o uso.
- CSS externo (modulos ou arquivos .css por componente)
- Fetch API para consumo REST
- localStorage para persistencia
- **json-server** como API REST (confirmado pelo professor e usado em aula)
- Camada **`src/services/`** com um arquivo de servico por entidade (`produtoService.js`, etc.) seguindo o padrao do exercicio-modelo: funcoes `criar / obter / listar / atualizar / remover` usando `fetch`.

## 13. Roadmap pos-entrega

- **Versao 1.5 (evolucao do MVP, prioridade alta apos a entrega):** migrar do modelo "uma compra ativa + historico" para **multiplas listas simultaneas nomeadas** (ex.: "Compra mensal", "Churrasco", "Mercado da semana"), com troca entre elas e cada lista mantendo sua propria meta. Estrutura de dados ja prevista para suportar essa migracao sem reescrever o estado.
- **Versao 2:** backend proprio (Node ou PHP), MySQL na Hostinger, autenticacao, sincronizacao entre dispositivos.
- **Versao 3:** OCR de etiqueta, reconhecimento de produto por foto, graficos de historico, comparacao entre supermercados.

## 14. User Stories (resumo)

Stories detalhadas com criterios de aceite vivem no Kanban (GitHub Projects), uma por card. Resumo:

- **US01.** Como usuario, quero ver os produtos disponiveis para escolher o que comprar.
- **US02.** Como usuario, quero cadastrar um produto novo quando ele nao existe no catalogo.
- **US03.** Como usuario, quero adicionar um produto a minha compra informando quantidade e preco.
- **US04.** Como usuario, quero ver o subtotal de cada item e o total da compra atualizados em tempo real.
- **US05.** Como usuario, quero definir uma meta de gasto opcional.
- **US06.** Como usuario, quero saber se estou dentro ou fora da meta enquanto compro.
- **US07.** Como usuario, quero remover um item que adicionei por engano.
- **US08.** Como usuario, quero que meus dados continuem salvos depois que eu fecho o navegador.
- **US09.** Como usuario, quero usar o app confortavelmente no celular.
- **US10.** Como usuario, quero finalizar a compra ao sair do mercado para comecar a proxima do zero sem perder o registro da anterior.
- **US11.** Como usuario, quero consultar minhas compras anteriores com data e total para acompanhar meus gastos.

Criterios de aceite de cada uma serao escritos como descricao do card no Kanban quando a story for puxada para "A fazer".
