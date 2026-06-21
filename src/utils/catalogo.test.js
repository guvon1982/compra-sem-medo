import { describe, it, expect } from "vitest";
import { normalizar, temNomeDuplicado } from "./catalogo";

/* ============================================================
   Testes da RN2 do PRD — "Nome do produto e obrigatorio e nao
   pode ser duplicado no catalogo (comparacao case-insensitive,
   ignorando espacos nas pontas)."
   ============================================================ */

const catalogo = [
  { id: "p1", nome: "Arroz Tio João 5kg" },
  { id: "p2", nome: "Feijão Camil 1kg" },
  { id: "p3", nome: "Sabão em pó OMO 1,6kg" },
];

describe("temNomeDuplicado", () => {
  it("detecta duplicata exata", () => {
    expect(temNomeDuplicado("Arroz Tio João 5kg", catalogo)).toBe(true);
  });

  it("detecta duplicata ignorando case (RN2)", () => {
    expect(temNomeDuplicado("ARROZ TIO JOÃO 5KG", catalogo)).toBe(true);
    expect(temNomeDuplicado("arroz tio joão 5kg", catalogo)).toBe(true);
  });

  it("detecta duplicata ignorando espacos nas pontas (RN2)", () => {
    expect(temNomeDuplicado("  Arroz Tio João 5kg  ", catalogo)).toBe(true);
    expect(temNomeDuplicado("\tFeijão Camil 1kg\n", catalogo)).toBe(true);
  });

  it("nao detecta duplicata para nome novo", () => {
    expect(temNomeDuplicado("Leite Itambé 1L", catalogo)).toBe(false);
  });

  it("ignora o proprio produto em modo edicao (p1 pode manter o nome)", () => {
    // simula edicao do p1 mantendo o nome — nao deve dar duplicidade
    expect(temNomeDuplicado("Arroz Tio João 5kg", catalogo, "p1")).toBe(false);
    // mas ainda detecta colisao com OUTRO produto (p2)
    expect(temNomeDuplicado("Feijão Camil 1kg", catalogo, "p1")).toBe(true);
  });

  it("modo criar (sem idAtual) compara contra todos", () => {
    expect(temNomeDuplicado("Arroz Tio João 5kg", catalogo, undefined)).toBe(true);
  });

  it("trata catalogo vazio sem quebrar", () => {
    expect(temNomeDuplicado("Qualquer Coisa", [])).toBe(false);
  });

  it("detecta duplicata ignorando acentos (leitura estrita PT-BR)", () => {
    // Acucar Uniao 1kg = Açúcar União 1kg em PT-BR — sao o mesmo produto
    const catAcento = [{ id: "p1", nome: "Açúcar União 1kg" }];
    expect(temNomeDuplicado("Acucar Uniao 1kg", catAcento)).toBe(true);
    expect(temNomeDuplicado("AÇÚCAR UNIÃO 1KG", catAcento)).toBe(true);
    expect(temNomeDuplicado("acucar uniao 1kg", catAcento)).toBe(true);
  });
});

describe("normalizar", () => {
  it("baixa caixa", () => {
    expect(normalizar("ABCdef")).toBe("abcdef");
  });

  it("remove acentos comuns do PT-BR", () => {
    expect(normalizar("Açúcar")).toBe("acucar");
    expect(normalizar("São Paulo")).toBe("sao paulo");
    expect(normalizar("Pão de Queijo")).toBe("pao de queijo");
  });

  it("remove espacos nas pontas", () => {
    expect(normalizar("  arroz  ")).toBe("arroz");
    expect(normalizar("\t\nfeijao\t\n")).toBe("feijao");
  });

  it("preserva espacos no meio (para busca por palavra parcial)", () => {
    expect(normalizar("Arroz Tio João")).toBe("arroz tio joao");
  });
});
