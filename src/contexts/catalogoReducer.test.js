import { describe, it, expect } from "vitest";
import { catalogoReducer, estadoInicialCatalogo } from "./catalogoReducer";

/* ============================================================
   Smoke tests do reducer do catalogo.
   Reducers sao funcoes puras: entrada -> acao -> saida.
   Aqui validamos cada acao isoladamente, sem renderizar nada.
   ============================================================ */

describe("catalogoReducer", () => {
  it("adiciona um produto novo no final da lista e gera id", () => {
    const novo = {
      name: "Produto Teste",
      category: "Alimentos",
      unit: "1kg",
      price: 9.9,
    };
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "adicionarProduto",
      payload: { produto: novo },
    });

    expect(state.produtos).toHaveLength(
      estadoInicialCatalogo.produtos.length + 1,
    );
    const adicionado = state.produtos.at(-1);
    expect(adicionado.name).toBe("Produto Teste");
    expect(adicionado.id).toBeTruthy();
  });

  it("preserva o id quando ele ja vem no payload", () => {
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "adicionarProduto",
      payload: { produto: { id: "p-fixo", name: "X", category: "Alimentos", unit: "1kg", price: 1 } },
    });
    expect(state.produtos.at(-1).id).toBe("p-fixo");
  });

  it("edita um produto existente sem alterar os demais", () => {
    const alvo = estadoInicialCatalogo.produtos[0];
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "editarProduto",
      payload: { id: alvo.id, dados: { price: 99.9 } },
    });

    expect(state.produtos[0].price).toBe(99.9);
    expect(state.produtos[0].name).toBe(alvo.name);
    expect(state.produtos).toHaveLength(estadoInicialCatalogo.produtos.length);
  });

  it("remove um produto pelo id", () => {
    const alvo = estadoInicialCatalogo.produtos[0];
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "removerProduto",
      payload: { id: alvo.id },
    });

    expect(state.produtos.find((p) => p.id === alvo.id)).toBeUndefined();
    expect(state.produtos).toHaveLength(
      estadoInicialCatalogo.produtos.length - 1,
    );
  });

  it("ignora acao desconhecida e devolve o mesmo estado", () => {
    const state = catalogoReducer(estadoInicialCatalogo, {
      type: "inexistente",
    });
    expect(state).toBe(estadoInicialCatalogo);
  });
});
