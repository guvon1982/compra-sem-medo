import { describe, it, expect, beforeEach } from "vitest";
import { carregarEstadoInicial, CHAVE_STORAGE } from "./CompraContext";
import { estadoInicialCompra } from "./compraReducer";

/* ============================================================
   Testes de carregarEstadoInicial — a "porta de entrada" do
   estado da compra. Garante o requisito do PRD de validar o
   formato ao carregar e resetar com aviso quando invalido.
   ============================================================ */

beforeEach(() => {
  localStorage.clear();
});

describe("carregarEstadoInicial", () => {
  it("primeira visita (storage vazio) usa o seed sem aviso", () => {
    const r = carregarEstadoInicial();
    expect(r.estado).toBe(estadoInicialCompra);
    expect(r.recuperadoComErro).toBe(false);
  });

  it("estado salvo valido e usado direto, sem aviso", () => {
    const salvo = {
      compraAtual: [{ id: "p1", quantidade: 2 }],
      meta: 100,
      historicoCompras: [],
    };
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(salvo));

    const r = carregarEstadoInicial();
    expect(r.estado).toEqual(salvo);
    expect(r.recuperadoComErro).toBe(false);
  });

  it("JSON corrompido cai no seed COM aviso", () => {
    localStorage.setItem(CHAVE_STORAGE, "{lixo invalido");

    const r = carregarEstadoInicial();
    expect(r.estado).toBe(estadoInicialCompra);
    expect(r.recuperadoComErro).toBe(true);
  });

  it("JSON valido mas shape errado cai no seed COM aviso", () => {
    localStorage.setItem(
      CHAVE_STORAGE,
      JSON.stringify({
        compraAtual: "deveria ser array",
        meta: null,
        historicoCompras: [],
      }),
    );

    const r = carregarEstadoInicial();
    expect(r.estado).toBe(estadoInicialCompra);
    expect(r.recuperadoComErro).toBe(true);
  });

  it("item da compra com quantidade negativa cai no seed COM aviso", () => {
    localStorage.setItem(
      CHAVE_STORAGE,
      JSON.stringify({
        compraAtual: [{ id: "p1", quantidade: -3 }],
        meta: null,
        historicoCompras: [],
      }),
    );

    const r = carregarEstadoInicial();
    expect(r.estado).toBe(estadoInicialCompra);
    expect(r.recuperadoComErro).toBe(true);
  });
});
