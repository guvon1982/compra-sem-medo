/* ============================================================
   mock.js — dados fake (apenas para o protótipo visual).
   Produtos brasileiros reais, categorias e histórico.
   Nenhuma lógica de negócio aqui — só dados.
   ============================================================ */

export const CATEGORIAS = ["Alimentos", "Bebidas", "Higiene", "Limpeza"];

export const UNIDADES = [
  "Unidade", "Pacote", "Caixa", "Garrafa", "Lata",
  "100g", "500g", "1kg", "5kg", "500ml", "900ml", "1L", "2L",
];

/* ícone de categoria (nome do componente Icon) */
export const ICONE_CATEGORIA = {
  Alimentos: "caixa",
  Bebidas: "info",
  Higiene: "tag",
  Limpeza: "tag",
};

export const PRODUTOS = [
  { id: "p1", nome: "Arroz Tio João 5kg", categoria: "Alimentos", unidade: "5kg", preco: 29.9 },
  { id: "p2", nome: "Feijão Camil 1kg", categoria: "Alimentos", unidade: "1kg", preco: 8.49 },
  { id: "p3", nome: "Café Pilão 500g", categoria: "Bebidas", unidade: "500g", preco: 14.9 },
  { id: "p4", nome: "Leite Itambé 1L", categoria: "Bebidas", unidade: "1L", preco: 5.29 },
  { id: "p5", nome: "Açúcar União 1kg", categoria: "Alimentos", unidade: "1kg", preco: 4.99 },
  { id: "p6", nome: "Macarrão Barilla 500g", categoria: "Alimentos", unidade: "500g", preco: 6.79 },
  { id: "p7", nome: "Óleo Soya 900ml", categoria: "Alimentos", unidade: "900ml", preco: 7.49 },
  { id: "p8", nome: "Sabão em pó OMO 1,6kg", categoria: "Limpeza", unidade: "1,6kg", preco: 22.9 },
  { id: "p9", nome: "Detergente Ypê 500ml", categoria: "Limpeza", unidade: "500ml", preco: 2.79 },
  { id: "p10", nome: "Papel higiênico Neve 12 rolos", categoria: "Higiene", unidade: "12 rolos", preco: 18.9 },
];

/* compra atual inicial (já com alguns itens p/ demonstrar o herói) */
export const COMPRA_INICIAL = [
  { id: "p1", quantidade: 1 },
  { id: "p4", quantidade: 2 },
  { id: "p6", quantidade: 1 },
];

export const META_INICIAL = 60;

/* histórico de compras anteriores */
export const HISTORICO = [
  { id: "h1", data: "28 mai 2026", total: 142.3, itens: 12, meta: 150 },
  { id: "h2", data: "21 mai 2026", total: 187.5, itens: 15, meta: 160 },
  { id: "h3", data: "14 mai 2026", total: 96.8, itens: 8, meta: null },
];
