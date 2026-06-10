import { describe, it, expect, vi, afterEach } from "vitest";
import { listar, criar, remover } from "./produtoService";

/* ============================================================
   Testes do produtoService — focados no tratamento de erro.
   Mockamos o `fetch` global para simular:
   - falha de rede (TypeError) -> mensagem amigavel dedicada
   - erro generico -> fallback em portugues
   - sucesso -> devolve o JSON parseado
   ============================================================ */

afterEach(() => {
  vi.restoreAllMocks();
});

describe("produtoService — tratamento de erro", () => {
  it("listar() devolve mensagem amigavel quando o fetch joga TypeError (API offline)", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    );

    const resp = await listar();

    expect(resp).toEqual({
      message: "Sem conexao com a API. Verifique se o servidor esta no ar.",
    });
  });

  it("criar() devolve mensagem amigavel em erro de rede", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    );

    const resp = await criar({ nome: "Arroz", preco: 10 });

    expect(resp.message).toBe(
      "Sem conexao com a API. Verifique se o servidor esta no ar.",
    );
  });

  it("remover() devolve mensagem amigavel em erro de rede", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new TypeError("Failed to fetch"),
    );

    const resp = await remover({ id: "p1" });

    expect(resp.message).toBe(
      "Sem conexao com a API. Verifique se o servidor esta no ar.",
    );
  });

  it("erro generico (nao-rede) cai no fallback em portugues", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Algo estranho"),
    );

    const resp = await listar();

    expect(resp.message).toBe(
      "Nao foi possivel completar a operacao: Algo estranho",
    );
  });

  it("sucesso devolve o JSON da resposta", async () => {
    const dados = [{ id: "p1", nome: "Arroz", preco: 10 }];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: async () => dados,
    });

    const resp = await listar();

    expect(resp).toEqual(dados);
  });
});
