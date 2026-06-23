# Compra Sem Medo

> Sua compra sob controle, sem susto no caixa.

## 📊 Apresentação do projeto

[![Apresentação Compra Sem Medo — clique para abrir o PDF](docs/Apresentacao/capa.png)](docs/Apresentacao/Apresentacao_CompraSemMedo.pdf)

> **Clique na capa acima** para abrir a [apresentação completa](docs/Apresentacao/Apresentacao_CompraSemMedo.pdf) (PDF, 14 slides) — problema, solução, telas, arquitetura e roadmap.

---

Aplicação web mobile-first em React para auxiliar pessoas a controlar gastos durante compras de supermercado. Projeto Final da Disciplina de Front-End - IESB, 5º Semestre | Prof. José Reginaldo.

## Funcionalidades (MVP)

- Catálogo de produtos consumido de API REST (json-server).
- Cadastro de novos produtos (formulário controlado com validação).
- Montar uma lista de compras informando quantidade e preço unitário.
- Cálculo automático de subtotal por item e total da compra.
- Meta de gasto opcional com indicador "dentro" (verde) ou "fora" (laranja).
- Finalizar compra e histórico de compras anteriores.
- Persistência local via localStorage (dados não somem ao fechar o navegador).
- Interface responsiva mobile-first.

Detalhes completos em [`docs/PRD.md`](docs/PRD.md).

## Telas

| Início | Minha compra | Catálogo |
| :---: | :---: | :---: |
| <img src="docs/screenshots/home.png" width="230" alt="Tela inicial" /> | <img src="docs/screenshots/listagem-compra.png" width="230" alt="Minha compra" /> | <img src="docs/screenshots/listagem-catalogo.png" width="230" alt="Catálogo" /> |

| Histórico | Cadastro |
| :---: | :---: |
| <img src="docs/screenshots/historico.png" width="230" alt="Histórico" /> | <img src="docs/screenshots/cadastro.png" width="230" alt="Cadastro de produto" /> |

## Stack

- **React 19** + **Vite 8**
- **react-router v7** para rotas (`/`, `/cadastro`, `/listagem`)
- **react-hook-form** para formulários e validação
- **Context API + useReducer** para estado compartilhado
- **Fetch API** + **json-server** para a camada REST
- **localStorage** para persistência local
- **Vitest** + **Testing Library** para testes
- **Docker** + **Docker Compose** para o ambiente de desenvolvimento
- CSS externo com tokens do design system aprovado

## Como rodar o projeto (Windows, Mac e Linux)

Esta seção é um passo a passo do zero, pensada para quem clona o projeto em uma
máquina nova (ex.: PC da faculdade). Os **comandos do projeto** (`git`, `npm`,
`docker`) são **idênticos** nos três sistemas — o que muda é apenas onde você
abre o terminal e como instala as ferramentas.

> ⚠️ **Não copie a pasta por pen drive.** A pasta `node_modules` contém
> binários compilados para a máquina de origem e **não funcionam em outra**.
> Sempre **clone do GitHub e instale do zero**.

### Pré-requisitos

Você precisa de **Git** e **Node.js 22+**. Docker é **opcional** (vale a pena
só se você quer um ambiente isolado).

| Ferramenta | Windows | Mac | Linux |
| --- | --- | --- | --- |
| **Git** | [git-scm.com/download/win](https://git-scm.com/download/win) | já vem; se não, `xcode-select --install` | `sudo apt install git` (Debian/Ubuntu) |
| **Node.js 22+** | [nodejs.org](https://nodejs.org) (LTS) | [nodejs.org](https://nodejs.org) ou `brew install node@22` | [nodejs.org](https://nodejs.org) ou via [nvm](https://github.com/nvm-sh/nvm) |
| **Docker** (opcional) | [Docker Desktop](https://www.docker.com/products/docker-desktop/) | [Docker Desktop](https://www.docker.com/products/docker-desktop/) | [Docker Engine](https://docs.docker.com/engine/install/) |

Para confirmar que estão instalados, abra um terminal e rode:

```bash
git --version
node --version    # precisa ser >= v22.0.0
npm --version
```

### Onde abrir o terminal

| | Programa | Shell padrão |
| --- | --- | --- |
| **Windows** | PowerShell, Git Bash ou Prompt de Comando | PowerShell |
| **Mac** | Terminal (já vem) ou iTerm | zsh |
| **Linux** | Terminal (já vem) | bash |

Nos três casos, navegue até a pasta onde quer guardar o projeto antes de
começar (`cd caminho/da/pasta`).

---

### Caminho A — Sem Docker (recomendado para começar) 🟢

É o mais simples e funciona igual nos três SOs. Só precisa do Git e do Node.

#### 1. Clonar o repositório

```bash
git clone https://github.com/guvon1982/compra-sem-medo.git
cd compra-sem-medo
```

#### 2. Instalar as dependências

```bash
npm install
```

> Demora ~30s a 1min na primeira vez. Pode aparecer um aviso de
> vulnerabilidade — é da dependência de desenvolvimento (`json-server`),
> não afeta a aplicação. Pode ignorar.

#### 3. Subir a API **e** o app — em dois terminais

> 🔑 **O catálogo precisa da API (`json-server`).** Se você rodar só o app,
> o catálogo aparece vazio com a mensagem "Sem conexão com a API". Os dois
> têm que estar no ar **ao mesmo tempo**.

**Terminal 1** — a API (deixe aberto, com a API rodando):

```bash
npm run api
```

Deve aparecer algo como: `JSON Server started on PORT :3000`.

**Terminal 2** — o app (abra um novo terminal na mesma pasta):

```bash
npm run dev
```

Deve aparecer: `➜ Local: http://localhost:5173/`.

#### 4. Abrir no navegador

Acesse **http://localhost:5173**. O catálogo aparece com os 10 produtos do
seed (`db.json`, versionado no Git).

#### 5. Como parar

Em cada terminal, aperte `Ctrl+C` (no Mac, também é `Ctrl+C` **dentro** do
terminal — não é `Cmd+C`). Pronto, ambos param.

---

### Caminho B — Com Docker (alternativa, ambiente isolado) 🐳

Vantagem: você não precisa do Node instalado no host. Tudo roda em containers.
Desvantagem: mais passos e a primeira execução demora vários minutos (baixa as
imagens).

> ⚠️ **Não misture com o Caminho A.** Se você rodou `npm install` no host
> antes, a pasta `node_modules` ficou com binários do seu SO (Mac/Windows) que
> **não funcionam dentro do Linux do container**. Antes de usar Docker, apague
> a pasta `node_modules` se ela existir (ou clone o projeto em outra pasta).

#### 1. Clonar o repositório

```bash
git clone https://github.com/guvon1982/compra-sem-medo.git
cd compra-sem-medo
```

#### 2. Subir os containers

```bash
docker compose up -d
```

Sobe dois serviços: `api` (json-server, porta 3000) e `app` (Node + Vite,
porta 5173). O `-d` (detached) deixa rodando em segundo plano. Na primeira
vez baixa as imagens (~10min de download, dependendo da internet).

#### 3. Instalar as dependências **dentro do container**

```bash
docker compose exec app npm install
```

Isso instala os pacotes na pasta `node_modules` com os binários certos
para o Linux do container. Sem este passo, o Vite não inicia.

#### 4. Iniciar o servidor de desenvolvimento

```bash
docker compose exec app npm run dev
```

> 💡 Note que **não** estamos usando `-d` aqui de propósito — assim você vê
> os logs do Vite e percebe na hora se algo der errado. O terminal fica
> "preso" com o Vite rodando — é o esperado.

Deve aparecer: `➜ Local: http://localhost:5173/`.

#### 5. Abrir no navegador

Acesse **http://localhost:5173**.

#### 6. Como parar

- Para parar o Vite: aperte `Ctrl+C` no terminal onde ele está rodando.
- Para parar **tudo** (containers, rede): em outro terminal, rode `docker compose down`.

---

### Como sei que está tudo certo? ✅

Abra **http://localhost:5173** (ou **http://localhost:5174** se a 5173 estava
ocupada — o Vite avisa qual porta usou) e confira:

1. A tela inicial carrega com o lema "Sua compra sob controle, sem susto no caixa."
2. Clicando em **"Iniciar compra"** ou no rodapé em **"Compra"**, abre a tela
   de Listagem com 3 abas (Minha compra, Catálogo, Histórico).
3. Na aba **Catálogo**, aparecem **10 produtos** (Arroz Tio João, Feijão Camil,
   Café Pilão...).

Se o catálogo aparece com os 10 produtos, **está 100% funcionando**.

### Dicas finais

- **O que vem no clone:** os 10 produtos do catálogo (no `db.json`).
- **O que começa vazio:** compra atual, meta e histórico. Eles ficam no
  `localStorage` do navegador daquela máquina, então cada PC começa do zero.
  (Ótimo para apresentar: comece limpo e demonstre cadastrando e comprando ao vivo.)

### Solução de problemas comuns

| Sintoma | Causa provável | O que fazer |
| --- | --- | --- |
| `Port 5173 is in use, trying another one...` | Já tem alguma coisa usando a porta (Docker antigo? outro projeto?). | O Vite cai sozinho na 5174 — não é grave. Use **http://localhost:5174**. Para "libertar" a 5173: `docker compose down`. |
| Catálogo aparece com **"Sem conexão com a API"** | Faltou subir a API (`json-server`). | Caminho A: rode `npm run api` em outro terminal. Caminho B: confira `docker compose ps` — `compra-sem-medo-api` precisa estar `Up`. |
| `docker compose exec app npm run dev` não mostra nada e nada abre | `node_modules` no host bagunçou o container. | Apague a pasta `node_modules`, rode `docker compose down`, depois siga o Caminho B do zero a partir do passo 2. |
| `Cannot find module './rolldown-binding...'` ao rodar `npm test` ou `npm run build` | `node_modules` foi instalado num SO diferente de onde está rodando. | Apague `node_modules` e rode `npm install` no SO onde vai rodar (ou dentro do container). |

### Scripts disponíveis (resumo)

Você não precisa decorar — o que conta para apresentar é `npm run api` + `npm run dev`. Esta tabela serve só de referência:

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento do app (HMR ativo, porta 5173) |
| `npm run api` | API REST com json-server (porta 3000) |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve o build estaticamente para validação (porta 4173) |
| `npm run lint` | Verifica o código com ESLint |
| `npm test` | Roda testes em modo watch |
| `npm run test:run` | Roda testes uma vez e sai (modo CI) |
| `npm run test:ui` | Abre a interface gráfica do Vitest |
| `npm run test:coverage` | Roda testes com relatório de cobertura |

## Variáveis de ambiente

O front lê variáveis com prefixo `VITE_` (padrão do Vite). A única usada hoje:

| Variável       | Padrão                  | Para que serve                           |
| -------------- | ----------------------- | ---------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000` | URL base da API REST (sem `/` no final). |

Em desenvolvimento não é preciso configurar nada — o código usa o `json-server`
local por padrão. Para apontar para outra API (ex.: em produção), copie
[`.env.example`](.env.example) para `.env` e ajuste o valor.

## Estrutura do projeto

```
.
├── docs/                  # PRD, SDD, design system, referências visuais
├── public/                # Assets estáticos servidos sem processamento
├── src/
│   ├── components/        # Componentes reutilizáveis do Design System
│   ├── pages/             # Uma pasta por rota (Home, Cadastro, Listagem, NotFound)
│   ├── contexts/          # Estado global (Context + reducers puros)
│   ├── services/          # Camada de acesso à API REST (produtoService)
│   ├── storage/           # Acesso isolado ao localStorage
│   ├── utils/             # Funções puras (currency, catalogo)
│   ├── data/              # Constantes e mock (categorias, unidades)
│   ├── styles/            # CSS externo com tokens do design system
│   ├── test/              # Configuração dos testes
│   ├── App.jsx            # Componente raiz com as rotas
│   └── main.jsx           # Ponto de entrada (BrowserRouter + Providers)
├── db.json                # Seed do catálogo (lido pelo json-server)
├── docker-compose.yml     # Ambiente de desenvolvimento containerizado
├── vite.config.js         # Configuração do Vite + Vitest
└── package.json
```

Para a visão detalhada de arquitetura, fluxo de dados e modelo de dados, ver
[`docs/SDD.md`](docs/SDD.md).

## Qualidade e acessibilidade (Lighthouse)

O [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview) (embutido
no Chrome DevTools) mede a qualidade da página em quatro eixos.

Resultado (modo **mobile**, sobre o **build de produção** — `npm run build` +
`npm run preview` em http://localhost:4173):

| Categoria      | Pontuação |
| -------------- | :-------: |
| Performance    | 70        |
| Accessibility  | 92        |
| Best Practices | 100       |
| SEO            | 91        |

> Importante medir sobre o **build** (`preview`), não sobre o `npm run dev`: no
> modo de desenvolvimento o código não é otimizado e a Performance sai
> artificialmente baixa. Para reproduzir: `F12` → aba **Lighthouse** →
> **Analyze page load** com a app aberta no preview.

## Workflow de Git

- `main` — versões "prontas". Recebe merge apenas no fim do projeto.
- `develop` — linha principal de desenvolvimento. Branch padrão do repositório.
- `feature/<nome>` — uma branch por feature, sempre nascendo de `develop` e voltando para `develop` via Pull Request.

## Documentação do projeto

- [`docs/PRD.md`](docs/PRD.md) — escopo, regras de negócio, critérios de sucesso.
- [`docs/SDD.md`](docs/SDD.md) — arquitetura, estrutura de pastas, fluxo e modelo de dados.
- [`docs/design-system-reference.md`](docs/design-system-reference.md) — tokens e regras visuais.
- [`docs/CompraSemMedo_DesignSystem_Aprovacao.png`](docs/CompraSemMedo_DesignSystem_Aprovacao.png) — referência visual aprovada.

## Licença

Projeto acadêmico. Uso pessoal e educacional.
