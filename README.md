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

## Rodar em outra máquina (do zero)

Cenário: você chegou numa máquina nova (ex.: o PC da faculdade) e quer rodar o
projeto. Pré-requisitos: **Git** + (**Docker Desktop** OU **Node 22+**).

> ⚠️ **Não copie a pasta por pen drive.** A `node_modules` tem binários
> compilados para a máquina de origem e não funcionam em outra. Sempre **clone
> e instale do zero**.

### 1. Clonar o repositório

```bash
git clone https://github.com/guvon1982/compra-sem-medo.git
cd compra-sem-medo
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Subir a API **e** o app (os dois!)

> 🔑 **O catálogo precisa da API (`json-server`).** Se você rodar só o app, o
> catálogo aparece vazio com "Sem conexão com a API". Tem que ter a API no ar
> também.

**Com Docker (recomendado):**

```bash
docker compose up -d                    # sobe a API (json-server, porta 3000) + o container do app
docker compose exec -d app npm run dev  # inicia o Vite (porta 5173)
```

**Sem Docker:** abra **dois terminais** na pasta do projeto:

```bash
npm run api    # terminal 1 — API (json-server) na porta 3000
npm run dev    # terminal 2 — app (Vite) na porta 5173
```

### 4. Abrir no navegador

Acesse **http://localhost:5173**. O catálogo aparece com os 10 produtos do seed
(`db.json`, versionado no git).

> **O que vem junto e o que não vem:** os 10 produtos do catálogo vêm no clone
> (estão no `db.json`). Já **compra, meta e histórico começam vazios** numa
> máquina nova — eles ficam no `localStorage` do navegador daquela máquina, não
> no código. (Ótimo para apresentar: comece limpo e demonstre cadastrando/
> comprando ao vivo.)

## Como rodar com Docker (recomendado)

Pré-requisitos:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando.

### 1. Subir o container

```bash
docker compose up -d
```

`-d` (detached) deixa o container rodando em segundo plano e devolve o terminal.

### 2. Instalar dependências dentro do container (primeira vez)

```bash
docker compose exec app npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
docker compose exec app npm run dev
```

Abra **http://localhost:5173** no navegador.

### 4. Rodar testes

```bash
docker compose exec app npm run test:run
```

### 5. Parar o ambiente

```bash
docker compose down
```

## Como rodar sem Docker (alternativa)

Pré-requisitos: Node 22+ instalado.

```bash
npm install
npm run dev
```

## Variáveis de ambiente

O front lê variáveis com prefixo `VITE_` (padrão do Vite). A única usada hoje:

| Variável       | Padrão                  | Para que serve                           |
| -------------- | ----------------------- | ---------------------------------------- |
| `VITE_API_URL` | `http://localhost:3000` | URL base da API REST (sem `/` no final). |

Em desenvolvimento não é preciso configurar nada — o código usa o `json-server`
local por padrão. Para apontar para outra API (ex.: em produção), copie
[`.env.example`](.env.example) para `.env` e ajuste o valor.

## Scripts disponíveis

| Comando                 | O que faz                                  |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | Servidor de desenvolvimento (HMR ativo)    |
| `npm run build`         | Gera o build de produção em `dist/`        |
| `npm run preview`       | Serve o build estaticamente para validação |
| `npm run lint`          | Verifica o código com ESLint               |
| `npm test`              | Roda testes em modo watch                  |
| `npm run test:run`      | Roda testes uma vez e sai (modo CI)        |
| `npm run test:ui`       | Abre a interface gráfica do Vitest         |
| `npm run test:coverage` | Roda testes com relatório de cobertura     |

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
