# Resumo do Projeto para Claude Code

## Contexto Geral

Este projeto sera desenvolvido como projeto final da materia de front-end. O usuario fara o trabalho sozinho e ainda precisa criar o repositorio no GitHub.

O usuario quer conduzir o projeto com boas praticas de Engenharia de Software e Arquitetura de Software. Como ele ainda esta aprendendo esses assuntos, Codex esta atuando como assistente de planejamento, arquitetura, implementacao e explicacao tecnica. Claude Code atuara como revisor tecnico externo.

A pasta do projeto ainda esta no inicio. Ate este momento, nenhum codigo da aplicacao foi implementado.

## Descricao do Projeto Solicitado pelo Professor

### Objetivo Geral

Desenvolver uma aplicacao web em React que implemente navegacao, formulario com validacao, listagem de dados e gerenciamento de estado compartilhado, simulando um cenario real de desenvolvimento frontend integrado a API REST.

### Requisitos Funcionais Obrigatorios

A aplicacao devera conter:

- menu de navegacao com no minimo tres paginas: Inicio, Cadastro e Listagem;
- roteamento no React;
- formulario controlado;
- validacao de campos;
- tratamento adequado de eventos;
- listagem dinamica de dados com renderizacao multipla;
- gerenciamento de estado compartilhado entre paginas, permitindo que dados cadastrados sejam refletidos na listagem;
- integracao com API REST para consumo e exibicao de dados;
- estilizacao com CSS externo;
- responsividade basica.

### Entrega

O projeto deve conter:

- repositorio no GitHub;
- organizacao das tarefas por meio de Kanban, usando GitHub Projects;
- commits organizados e coerentes com a evolucao do projeto;
- aplicacao executavel localmente.

### Criterios de Avaliacao

A avaliacao sera baseada em:

- Estrutura e Organizacao do Projeto;
- Implementacao Tecnica: React, rotas, estado e API;
- Validacao e Tratamento de Eventos;
- Interface e Responsividade: CSS;
- Versionamento e Organizacao do Projeto: Git e Kanban.

## Ideia do Usuario

O usuario quer criar um site responsivo, com abordagem mobile first, para auxiliar pessoas durante compras no supermercado.

### Problema Identificado

Muitas pessoas vao ao supermercado sem lista de compras. Mesmo quando possuem uma lista, normalmente nao sabem quanto a compra esta custando em tempo real, a menos que usem uma calculadora manualmente, o que e pouco pratico.

### Proposta Inicial

A aplicacao ajudara o usuario a:

- consultar produtos ja cadastrados no app;
- adicionar novos produtos;
- criar uma lista de compras para cada ida ao supermercado;
- informar quantidade e preco unitario de cada produto;
- calcular automaticamente o subtotal de cada item;
- calcular automaticamente o total da compra;
- definir uma meta opcional de gasto;
- acompanhar quanto da meta ja foi consumido;
- saber se ainda esta dentro da meta ou se ultrapassou o limite.

### Funcionalidades Futuras Desejadas

O usuario tambem demonstrou interesse em funcionalidades mais avancadas:

- cadastrar preco unitario a partir de foto da etiqueta/preco;
- cadastrar produto a partir de foto;
- reconhecer automaticamente informacoes por imagem;
- acompanhar historico de precos de produtos ao longo do tempo;
- visualizar a evolucao dos precos para entender aumentos e variacoes.

Foi sugerido que reconhecimento por foto/OCR fique fora do MVP da disciplina, pois aumenta bastante a complexidade. Essas ideias devem aparecer no PRD como evolucoes futuras.

## Recomendacao de Escopo MVP

Como o usuario fara o projeto sozinho, a recomendacao foi manter um MVP claro, pequeno e bem executado.

### MVP Recomendado para o Projeto Final

1. Catalogo de produtos
   - Produtos iniciais carregados ou simulados.
   - Cadastro manual de novos produtos.
   - Campos sugeridos: nome, categoria, unidade e observacao opcional.

2. Lista de compras
   - Usuario adiciona produtos a compra atual.
   - Informa quantidade e preco unitario.
   - Sistema calcula subtotal do item.
   - Sistema calcula total geral da compra.

3. Meta de gasto
   - Usuario pode definir uma meta opcional.
   - App mostra total gasto.
   - App mostra valor restante ou valor excedido.

4. Listagem
   - Pagina para visualizar produtos cadastrados e/ou itens da compra.
   - Dados cadastrados no formulario devem aparecer na listagem via estado compartilhado.

5. Historico simples de precos
   - Quando um produto recebe preco em uma compra, o app pode salvar preco e data.
   - Para o MVP, esse historico pode ser exibido em tabela simples.
   - Graficos podem ficar como melhoria futura.

6. API REST
   - A aplicacao precisa consumir dados de uma API REST.
   - Sugestao inicial: usar API publica ou fake API para carregar produtos/categorias iniciais.
   - Os dados do cadastro do usuario podem ser controlados no estado compartilhado da aplicacao.

## Stack Tecnica Recomendada

Para o projeto da disciplina, foi recomendado:

- React;
- Vite;
- React Router;
- Context API com useReducer para estado compartilhado;
- CSS externo;
- Fetch API ou Axios para consumo REST;
- localStorage para persistencia local simples;
- GitHub para versionamento;
- GitHub Projects para Kanban;
- deploy estatico na Hostinger, se a versao final nao tiver backend.

Foi sugerido evitar Redux, Zustand ou arquiteturas muito pesadas neste momento, pois o projeto precisa ser didatico, controlado e bem entregue.

## Banco de Dados, localStorage e Deploy

O usuario perguntou se, para colocar a aplicacao no ar em um servidor Linux da Hostinger, o banco teria que ser MySQL.

Foi explicado que:

- para o projeto academico, nao e necessario comecar com MySQL;
- uma versao React estatica com localStorage atende bem ao escopo inicial;
- localStorage persiste dados no navegador mesmo depois de atualizar a pagina, fechar o navegador ou reiniciar o computador;
- os dados so somem se o usuario limpar os dados do navegador, se o codigo apagar os dados, se abrir em outro navegador/computador, ou se houver mudanca estrutural sem migracao;
- para um sistema real com multiplos usuarios, login e dados acessiveis em varios dispositivos, o ideal seria backend proprio com banco de dados.

### Estrategia Recomendada

Versao 1 - Projeto Final:

- React + Vite;
- React Router;
- Context API/useReducer;
- CSS externo;
- consumo de API REST publica;
- localStorage para persistir produtos, compra atual, meta e historico simples.

Versao 2 - Evolucao Real:

- backend proprio;
- API REST propria;
- MySQL;
- autenticacao de usuarios;
- historico de compras por usuario;
- dados sincronizados entre dispositivos.

Versao 3 - Avancada:

- OCR/foto de preco;
- cadastro por imagem;
- graficos de evolucao de preco;
- comparacao entre supermercados.

## Persistencia Local Planejada

Foi explicado ao usuario que o professor podera navegar no app, cadastrar, excluir e atualizar a pagina sem perder os dados, desde que seja usado localStorage corretamente.

Dados que podem ser persistidos:

- produtos cadastrados;
- lista de compras atual;
- meta de gasto;
- historico de precos.

Exemplo conceitual de estrutura:

```json
{
  "produtos": [
    {
      "id": "1",
      "nome": "Arroz",
      "categoria": "Alimentos",
      "unidade": "kg"
    }
  ],
  "compraAtual": [
    {
      "id": "item-1",
      "produtoId": "1",
      "quantidade": 2,
      "precoUnitario": 24.9,
      "subtotal": 49.8
    }
  ],
  "meta": 300,
  "historicoPrecos": [
    {
      "produtoId": "1",
      "preco": 24.9,
      "data": "2026-06-02"
    }
  ]
}
```

## Documentos Recomendados para o Projeto

Foi sugerido criar documentacao objetiva, sem burocracia excessiva:

- docs/PRD.md;
- docs/SDD.md;
- docs/USER_STORIES.md;
- docs/BACKLOG.md;
- docs/KANBAN.md;
- docs/API.md;
- README.md.

### PRD - Product Requirements Document

Deve responder: o que estamos construindo e por que?

Deve conter:

- nome do projeto;
- problema que resolve;
- publico-alvo;
- objetivos principais;
- funcionalidades obrigatorias;
- funcionalidades desejaveis;
- regras de negocio;
- fluxos principais do usuario;
- criterios de sucesso;
- restricoes do trabalho.

### SDD - Software Design Document

Deve responder: como vamos construir?

Deve conter:

- arquitetura do front-end;
- estrutura de pastas;
- escolha de tecnologias;
- organizacao de componentes;
- modelo de dados;
- rotas/telas;
- estados da aplicacao;
- integracoes com API;
- padroes de codigo;
- responsividade;
- estrategia de testes;
- decisoes tecnicas importantes.

### User Stories

Transformam funcionalidades em historias de usuario com criterios de aceite.

### Mapa de Telas / Wireframe

Define telas, componentes, navegacao e estados de interface.

### Backlog de Desenvolvimento

Quebra o projeto em tarefas implementaveis.

## Fluxo de Trabalho Proposto

```text
Especificacoes do trabalho
        ->
PRD
        ->
User Stories
        ->
Mapa de telas / Fluxos
        ->
SDD
        ->
Backlog tecnico
        ->
Implementacao
        ->
Testes e refinamento
        ->
Deploy e apresentacao
```

## Divisao de Responsabilidades Entre Assistentes

### Codex

Responsavel por:

- ajudar no planejamento do projeto;
- transformar o enunciado em PRD, SDD, user stories e backlog;
- propor arquitetura;
- implementar codigo;
- organizar tarefas;
- explicar decisoes tecnicas;
- ajustar o projeto com base nas revisoes recebidas.

### Claude Code

Responsavel por:

- revisar codigo;
- apontar bugs, riscos e regressoes;
- avaliar arquitetura, legibilidade e organizacao;
- sugerir melhorias;
- verificar qualidade tecnica;
- identificar lacunas de teste;
- questionar decisoes tecnicas quando necessario.

## Fluxo de Revisao com Claude Code

```text
1. Usuario envia especificacoes e ideia do projeto.
2. Codex monta PRD, SDD, user stories e backlog.
3. Codex implementa uma etapa.
4. Usuario pede revisao ao Claude Code.
5. Usuario traz os comentarios do Claude Code para o Codex.
6. Codex analisa o feedback e implementa os ajustes necessarios.
7. O ciclo se repete ate o projeto ficar pronto.
```

## Observacoes Importantes para a Revisao

- O usuario quer aprender boas praticas durante o processo.
- O projeto deve ser pequeno o suficiente para uma pessoa desenvolver.
- O projeto deve cumprir explicitamente os requisitos do professor.
- A arquitetura deve ser simples, clara e defensavel em apresentacao.
- O escopo academico deve priorizar React, rotas, formulario, validacao, estado compartilhado, API, CSS e responsividade.
- localStorage foi escolhido como persistencia adequada para a versao academica.
- MySQL/backend proprio ficam como evolucao futura, nao como requisito inicial.
- Recursos com foto/OCR devem ser tratados como roadmap futuro, nao como MVP.
- O proximo passo recomendado e criar PRD, SDD, user stories, backlog e estrutura inicial do projeto.

