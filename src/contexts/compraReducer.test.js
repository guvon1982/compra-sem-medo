import { describe, it, expect } from "vitest";
import {
  compraReducer,
  estadoInicialCompra,
  validarEstadoCompra,
} from "./compraReducer";

/* ============================================================
   Smoke tests do reducer da compra.
   Cada teste monta um estado base pequeno (so o que importa
   para a acao em questao) e checa o estado resultante.
   ============================================================ */

describe("compraReducer", () => {
  it("adicionarItem insere produto novo com quantidade 1", () => {
    const base = { ...estadoInicialCompra, compraAtual: [] };
    const state = compraReducer(base, {
      type: "adicionarItem",
      payload: { produtoId: "p1" },
    });
    expect(state.compraAtual).toEqual([{ id: "p1", quantidade: 1 }]);
  });

  it("adicionarItem incrementa quando o produto ja esta na compra", () => {
    const base = {
      ...estadoInicialCompra,
      compraAtual: [{ id: "p1", quantidade: 2 }],
    };
    const state = compraReducer(base, {
      type: "adicionarItem",
      payload: { produtoId: "p1" },
    });
    expect(state.compraAtual).toEqual([{ id: "p1", quantidade: 3 }]);
  });

  it("incrementar soma 1 na quantidade do item informado", () => {
    const base = {
      ...estadoInicialCompra,
      compraAtual: [{ id: "p1", quantidade: 1 }, { id: "p2", quantidade: 4 }],
    };
    const state = compraReducer(base, {
      type: "incrementar",
      payload: { id: "p1" },
    });
    expect(state.compraAtual.find((e) => e.id === "p1").quantidade).toBe(2);
    expect(state.compraAtual.find((e) => e.id === "p2").quantidade).toBe(4);
  });

  it("decrementar reduz 1 e remove o item quando chega a zero", () => {
    const base = {
      ...estadoInicialCompra,
      compraAtual: [{ id: "p1", quantidade: 1 }, { id: "p2", quantidade: 3 }],
    };
    const state = compraReducer(base, {
      type: "decrementar",
      payload: { id: "p1" },
    });
    expect(state.compraAtual.find((e) => e.id === "p1")).toBeUndefined();
    expect(state.compraAtual.find((e) => e.id === "p2").quantidade).toBe(3);
  });

  it("removerItem tira o item pelo id", () => {
    const base = {
      ...estadoInicialCompra,
      compraAtual: [{ id: "p1", quantidade: 5 }, { id: "p2", quantidade: 1 }],
    };
    const state = compraReducer(base, {
      type: "removerItem",
      payload: { id: "p1" },
    });
    expect(state.compraAtual).toEqual([{ id: "p2", quantidade: 1 }]);
  });

  it("definirMeta troca o valor da meta", () => {
    const state = compraReducer(estadoInicialCompra, {
      type: "definirMeta",
      payload: { valor: 200 },
    });
    expect(state.meta).toBe(200);
  });

  it("finalizarCompra zera a compra e empilha registro no historico", () => {
    const base = {
      compraAtual: [{ id: "p1", quantidade: 2 }],
      meta: 100,
      historicoCompras: [],
    };
    const state = compraReducer(base, {
      type: "finalizarCompra",
      payload: { total: 50, itens: 2, dataAtual: new Date("2026-06-05") },
    });

    expect(state.compraAtual).toEqual([]);
    expect(state.historicoCompras).toHaveLength(1);
    expect(state.historicoCompras[0]).toMatchObject({
      total: 50,
      itens: 2,
      meta: 100,
    });
    expect(state.historicoCompras[0].id).toBeTruthy();
    expect(state.historicoCompras[0].data).toBeTruthy();
  });

  it("ignora acao desconhecida e devolve o mesmo estado", () => {
    const state = compraReducer(estadoInicialCompra, {
      type: "inexistente",
    });
    expect(state).toBe(estadoInicialCompra);
  });
});

describe("validarEstadoCompra", () => {
  it("aceita o proprio estadoInicialCompra (seed valido)", () => {
    expect(validarEstadoCompra(estadoInicialCompra)).toBe(true);
  });

  it("aceita estado minimo valido (compra vazia, sem meta, sem historico)", () => {
    expect(
      validarEstadoCompra({
        compraAtual: [],
        meta: null,
        historicoCompras: [],
      }),
    ).toBe(true);
  });

  it("rejeita null e undefined", () => {
    expect(validarEstadoCompra(null)).toBe(false);
    expect(validarEstadoCompra(undefined)).toBe(false);
  });

  it("rejeita objeto sem campos obrigatorios", () => {
    expect(validarEstadoCompra({})).toBe(false);
    expect(validarEstadoCompra({ compraAtual: [] })).toBe(false);
    expect(
      validarEstadoCompra({ compraAtual: [], meta: null }),
    ).toBe(false);
  });

  it("rejeita quando compraAtual nao e array", () => {
    expect(
      validarEstadoCompra({
        compraAtual: "p1",
        meta: null,
        historicoCompras: [],
      }),
    ).toBe(false);
  });

  it("rejeita item da compra com shape errado", () => {
    expect(
      validarEstadoCompra({
        compraAtual: [{ id: "p1" }], // falta quantidade
        meta: null,
        historicoCompras: [],
      }),
    ).toBe(false);

    expect(
      validarEstadoCompra({
        compraAtual: [{ id: 123, quantidade: 1 }], // id nao e string
        meta: null,
        historicoCompras: [],
      }),
    ).toBe(false);

    expect(
      validarEstadoCompra({
        compraAtual: [{ id: "p1", quantidade: 0 }], // quantidade <= 0
        meta: null,
        historicoCompras: [],
      }),
    ).toBe(false);
  });

  it("rejeita meta invalida (string, zero, negativa)", () => {
    expect(
      validarEstadoCompra({
        compraAtual: [],
        meta: "100",
        historicoCompras: [],
      }),
    ).toBe(false);
    expect(
      validarEstadoCompra({
        compraAtual: [],
        meta: 0,
        historicoCompras: [],
      }),
    ).toBe(false);
    expect(
      validarEstadoCompra({
        compraAtual: [],
        meta: -50,
        historicoCompras: [],
      }),
    ).toBe(false);
  });

  it("rejeita historicoCompras que nao e array", () => {
    expect(
      validarEstadoCompra({
        compraAtual: [],
        meta: null,
        historicoCompras: {},
      }),
    ).toBe(false);
  });
});
