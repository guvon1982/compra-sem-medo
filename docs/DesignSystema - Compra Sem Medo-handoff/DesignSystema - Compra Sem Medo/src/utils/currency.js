/* ============================================================
   currency.js — formatação de moeda em Real (pt-BR).
   Sempre vírgula decimal e duas casas: 24.9 -> "R$ 24,90".
   ============================================================ */

export function formatBRL(value) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* número simples com vírgula decimal, sem símbolo (ex.: "1,5 kg") */
export function formatNum(value, digits = 0) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
