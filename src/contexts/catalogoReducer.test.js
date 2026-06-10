import { describe, it, expect } from "vitest";
import { catalogoReducer, estadoInicialCatalogo } from "./catalogoReducer";

/* ============================================================
   Smoke tests do reducer do catalogo.
   Reducers sao funcoes puras: entrada -> acao -> saida.
   A logica async (fetch, esperar resposta) vive no Provider e
   nao e testada aqui — aqui so o efeito sincrono da acao.

   Como o estado inicial agora comeca com produtos vazios
   (sao carregados do json-server na montagem do Provider),
   alguns testes montam um estado-base com produtos plantados
   para validar editar/remover.
   ============================================================ */

const exemploProduto = (overrides = {}) => ({
  id: "p1",
  nome: "Arroz",
  categoria: "Alimentos",
  unidade: "5kg",
  preco: 29.9,
  ...overrides,
});

describe("catalogoReducer", () => {
  it("estado inicial tem produtos vazios, carregando=true e sem erro", () => {
    expect(estadoInicialCatalogo).toEqual({
      produtos: [],
      carregando: true,
      erro: null,
    });
  });

  it("iniciarCarregamento liga carregando e limpa erro", () => {
    const base = { produtos: [], carregando: false, erro: "Falhou" };
    const state = catalogoReducer(base, { type: "iniciarCarregamento" });
    expect(state).toEqual({ produtos: [], carregando: true, erro: null });
  });

  it("definirProdutos substitui a lista e desliga carregando", () => {
    const produtos = [exemploProduto(), exemploProduto({ id: "p2", nome: "Feijao" })];
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "definirProdutos",
      payload: { produtos },
    });
    expect(state.produtos).toEqual(produtos);
    expect(state.carregando).toBe(false);
    expect(state.erro).toBeNull();
  });

  it("definirErro guarda a mensagem e desliga carregando", () => {
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "definirErro",
      payload: { erro: "Deu ruim! sem rede" },
    });
    expect(state.carregando).toBe(false);
    expect(state.erro).toBe("Deu ruim! sem rede");
  });

  it("adicionarProduto insere o produto recebido (id ja vem do servidor)", () => {
    const base = {
      produtos: [exemploProduto()],
      carregando: false,
      erro: null,
    };
    const novo = exemploProduto({ id: "p-novo", nome: "Cafe" });
    const state = catalogoReducer(base, {
      type: "adicionarProduto",
      payload: { produto: novo },
    });
    expect(state.produtos).toHaveLength(2);
    expect(state.produtos.at(-1)).toEqual(novo);
  });

  it("editarProduto aplica dados sobre o produto existente", () => {
    const base = {
      produtos: [exemploProduto()],
      carregando: false,
      erro: null,
    };
    const state = catalogoReducer(base, {
      type: "editarProduto",
      payload: { id: "p1", dados: { preco: 35.5 } },
    });
    expect(state.produtos[0].preco).toBe(35.5);
    expect(state.produtos[0].nome).toBe("Arroz");
  });

  it("removerProduto tira o produto pelo id", () => {
    const base = {
      produtos: [
        exemploProduto(),
        exemploProduto({ id: "p2", nome: "Feijao" }),
      ],
      carregando: false,
      erro: null,
    };
    const state = catalogoReducer(base, {
      type: "removerProduto",
      payload: { id: "p1" },
    });
    expect(state.produtos).toHaveLength(1);
    expect(state.produtos[0].id).toBe("p2");
  });

  it("ignora acao desconhecida e devolve o mesmo estado", () => {
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "inexistente",
    });
    expect(state).toBe(estadoInicialCatalogo);
  });
});
