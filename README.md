# Compra Sem Medo

> Sua compra sob controle, sem susto no caixa.

Aplicacao web mobile-first em React para auxiliar pessoas a controlar gastos durante compras de supermercado. Projeto final da disciplina de Front-End (IESB, 5o semestre).

## Funcionalidades (MVP)

- Catalogo de produtos consumido de API REST (json-server).
- Cadastro de novos produtos (formulario controlado com validacao).
- Montar uma lista de compras informando quantidade e preco unitario.
- Calculo automatico de subtotal por item e total da compra.
- Meta de gasto opcional com indicador "dentro" (verde) ou "fora" (laranja).
- Finalizar compra e historico de compras anteriores.
- Persistencia local via localStorage (dados nao somem ao fechar o navegador).
- Interface responsiva mobile-first.

Detalhes completos em [`docs/PRD.md`](docs/PRD.md).

## Stack

- **React 19** + **Vite 8**
- **react-router v7** para rotas (`/`, `/cadastro`, `/listagem`)
- **react-hook-form** para formularios e validacao
- **Context API + useReducer** para estado compartilhado
- **Fetch API** + **json-server** para a camada REST
- **localStorage** para persistencia local
- **Vitest** + **Testing Library** para testes
- **Docker** + **Docker Compose** para o ambiente de desenvolvimento
- CSS externo com tokens do design system aprovado

## Como rodar com Docker (recomendado)

Pre-requisitos:

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando.

### 1. Subir o container

```bash
docker compose up -d
```

`-d` (detached) deixa o container rodando em segundo plano e devolve o terminal.

### 2. Instalar dependencias dentro do container (primeira vez)

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

Pre-requisitos: Node 22+ instalado.

```bash
npm install
npm run dev
```

## Scripts disponiveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento (HMR ativo) |
| `npm run build` | Gera o build de producao em `dist/` |
| `npm run preview` | Serve o build estaticamente para validacao |
| `npm run lint` | Verifica o codigo com ESLint |
| `npm test` | Roda testes em modo watch |
| `npm run test:run` | Roda testes uma vez e sai (modo CI) |
| `npm run test:ui` | Abre a interface grafica do Vitest |
| `npm run test:coverage` | Roda testes com relatorio de cobertura |

## Estrutura do projeto

```
.
├── docs/                  # PRD, design system, referencias visuais
├── public/                # Assets estaticos servidos sem processamento
├── src/
│   ├── assets/            # Imagens importadas pelo codigo
│   ├── test/              # Configuracao dos testes
│   ├── App.jsx            # Componente raiz com rotas
│   ├── main.jsx           # Ponto de entrada (BrowserRouter)
│   └── ...                # pages/, components/, contexts/, services/, storage/ (a criar)
├── docker-compose.yml     # Ambiente de desenvolvimento containerizado
├── vite.config.js         # Configuracao do Vite + Vitest
└── package.json
```

## Workflow de Git

- `main` — versoes "prontas". Recebe merge apenas no fim do projeto.
- `develop` — linha principal de desenvolvimento. Branch padrao do repositorio.
- `feature/<nome>` — uma branch por feature, sempre nascendo de `develop` e voltando para `develop` via Pull Request.

## Documentacao do projeto

- [`docs/PRD.md`](docs/PRD.md) — escopo, regras de negocio, criterios de sucesso.
- [`docs/design-system-reference.md`](docs/design-system-reference.md) — tokens e regras visuais.
- [`docs/CompraSemMedo_DesignSystem_Aprovacao.png`](docs/CompraSemMedo_DesignSystem_Aprovacao.png) — referencia visual aprovada.

## Licenca

Projeto academico. Uso pessoal e educacional.
