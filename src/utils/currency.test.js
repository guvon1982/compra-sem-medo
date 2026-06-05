import { describe, it, expect } from "vitest";
import { formatBRL, formatNum, parsePreco } from "./currency";

/* ============================================================
   Testes das funcoes utilitarias de moeda.

   formatBRL e formatNum: confirmamos so o contrato basico
   (pt-BR, virgula decimal, sem quebrar com entrada invalida).

   parsePreco: e a funcao mais critica — tem heuristica para
   decidir se ponto e milhar ou decimal. Cobrimos os 6 padroes
   listados na documentacao da funcao + casos invalidos.
   ============================================================ */

describe("formatBRL", () => {
  it("formata numero como R$ com duas casas e virgula decimal", () => {
    expect(formatBRL(9.9)).toMatch(/R\$\s?9,90/);
    expect(formatBRL(1234.5)).toMatch(/R\$\s?1\.234,50/);
  });

  it("usa zero para entrada invalida em vez de quebrar", () => {
    expect(formatBRL(NaN)).toMatch(/R\$\s?0,00/);
    expect(formatBRL(undefined)).toMatch(/R\$\s?0,00/);
  });
});

describe("formatNum", () => {
  it("formata sem simbolo, com virgula decimal", () => {
    expect(formatNum(1.5, 1)).toBe("1,5");
    expect(formatNum(1234, 0)).toBe("1.234");
  });
});

describe("parsePreco", () => {
  // ----- Padroes brasileiros classicos -----

  it("aceita pt-BR com virgula decimal: '9,90' -> 9.9", () => {
    expect(parsePreco("9,90")).toBe(9.9);
  });

  it("aceita pt-BR com milhar e decimal: '1.234,56' -> 1234.56", () => {
    expect(parsePreco("1.234,56")).toBe(1234.56);
  });

  it("aceita sem separador de milhar: '1234,56' -> 1234.56", () => {
    expect(parsePreco("1234,56")).toBe(1234.56);
  });

  // ----- Atalhos com ponto (o bug que motivou tudo) -----

  it("aceita ponto como decimal quando seguido de 2 digitos: '9.90' -> 9.9", () => {
    expect(parsePreco("9.90")).toBe(9.9);
  });

  it("aceita ponto como decimal quando seguido de 1 digito: '9.5' -> 9.5", () => {
    expect(parsePreco("9.5")).toBe(9.5);
  });

  it("aceita estilo americano com milhar e decimal por ponto: '1234.56' -> 1234.56", () => {
    expect(parsePreco("1234.56")).toBe(1234.56);
  });

  // ----- Ambiguidade do ponto: 3+ digitos depois = milhar -----

  it("interpreta '1.234' como milhar (sem decimal) -> 1234", () => {
    expect(parsePreco("1.234")).toBe(1234);
  });

  it("interpreta '1.234.567' como milhar completo -> 1234567", () => {
    expect(parsePreco("1.234.567")).toBe(1234567);
  });

  // ----- Inteiros e espacos -----

  it("aceita inteiro sem separador: '9' -> 9", () => {
    expect(parsePreco("9")).toBe(9);
  });

  it("ignora espacos nas pontas: '  9,90  ' -> 9.9", () => {
    expect(parsePreco("  9,90  ")).toBe(9.9);
  });

  // ----- Entradas invalidas -----

  it("devolve NaN para string vazia", () => {
    expect(parsePreco("")).toBeNaN();
  });

  it("devolve NaN para texto sem digitos", () => {
    expect(parsePreco("abc")).toBeNaN();
  });

  it("devolve NaN para null/undefined", () => {
    expect(parsePreco(null)).toBeNaN();
    expect(parsePreco(undefined)).toBeNaN();
  });

  it("devolve NaN para so um separador, sem digito", () => {
    expect(parsePreco(",")).toBeNaN();
    expect(parsePreco(".")).toBeNaN();
  });
});
