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
  { id: "p1", name: "Arroz Tio João 5kg", category: "Alimentos", unit: "5kg", price: 29.9 },
  { id: "p2", name: "Feijão Camil 1kg", category: "Alimentos", unit: "1kg", price: 8.49 },
  { id: "p3", name: "Café Pilão 500g", category: "Bebidas", unit: "500g", price: 14.9 },
  { id: "p4", name: "Leite Itambé 1L", category: "Bebidas", unit: "1L", price: 5.29 },
  { id: "p5", name: "Açúcar União 1kg", category: "Alimentos", unit: "1kg", price: 4.99 },
  { id: "p6", name: "Macarrão Barilla 500g", category: "Alimentos", unit: "500g", price: 6.79 },
  { id: "p7", name: "Óleo Soya 900ml", category: "Alimentos", unit: "900ml", price: 7.49 },
  { id: "p8", name: "Sabão em pó OMO 1,6kg", category: "Limpeza", unit: "1,6kg", price: 22.9 },
  { id: "p9", name: "Detergente Ypê 500ml", category: "Limpeza", unit: "500ml", price: 2.79 },
  { id: "p10", name: "Papel higiênico Neve 12 rolos", category: "Higiene", unit: "12 rolos", price: 18.9 },
];

/* compra atual inicial (já com alguns itens p/ demonstrar o herói) */
export const COMPRA_INICIAL = [
  { id: "p1", quantity: 1 },
  { id: "p4", quantity: 2 },
  { id: "p6", quantity: 1 },
];

export const META_INICIAL = 60;

/* histórico de compras anteriores */
export const HISTORICO = [
  { id: "h1", data: "28 mai 2026", total: 142.3, itens: 12, meta: 150 },
  { id: "h2", data: "21 mai 2026", total: 187.5, itens: 15, meta: 160 },
  { id: "h3", data: "14 mai 2026", total: 96.8, itens: 8, meta: null },
];
