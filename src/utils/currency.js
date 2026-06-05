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

/* ============================================================
   parsePreco — interpreta texto digitado pelo usuario como
   numero (em centavos/decimais), aceitando os formatos:
     "9,90"      -> 9.9        (pt-BR padrao)
     "9.90"      -> 9.9        (atalho usando ponto)
     "1.234,56"  -> 1234.56    (pt-BR com milhar)
     "1234.56"   -> 1234.56    (estilo americano)
     "1234,56"   -> 1234.56    (sem milhar)
     "1.234"     -> 1234       (ponto unico com 3 digitos = milhar)
     ""/"abc"    -> NaN        (entrada invalida)

   Heuristica para resolver a ambiguidade do ponto:
   - Se tem virgula no texto, segue regra pt-BR pura (ponto e
     milhar, virgula e decimal).
   - Se so tem ponto(s), olhamos o ULTIMO ponto:
     - seguido de 1 ou 2 digitos -> decimal (ex.: "9.90", "9.5")
     - qualquer outra coisa     -> milhar (ex.: "1.234")

   Devolve NaN para entradas que nao representam numero valido —
   quem chamar e responsavel por tratar (no Cadastro usamos
   Number.isNaN para mostrar erro inline).
   ============================================================ */
export function parsePreco(txt) {
  const trimmed = String(txt ?? "").trim();
  if (!trimmed) return NaN;

  const temVirgula = trimmed.includes(",");

  let normalizado;
  if (temVirgula) {
    // pt-BR padrao: pontos sao milhar (removemos), virgula vira ponto decimal.
    normalizado = trimmed.replace(/\./g, "").replace(",", ".");
  } else {
    const ultimoPonto = trimmed.lastIndexOf(".");
    const digitosDepois =
      ultimoPonto >= 0 ? trimmed.length - ultimoPonto - 1 : 0;

    if (ultimoPonto >= 0 && (digitosDepois === 1 || digitosDepois === 2)) {
      // ultimo ponto e decimal; pontos anteriores (se houver) sao milhar.
      const inteiro = trimmed.slice(0, ultimoPonto).replace(/\./g, "");
      const decimal = trimmed.slice(ultimoPonto + 1);
      normalizado = `${inteiro}.${decimal}`;
    } else {
      // todos os pontos sao milhar (ou nao ha pontos).
      normalizado = trimmed.replace(/\./g, "");
    }
  }

  const n = parseFloat(normalizado);
  return Number.isFinite(n) ? n : NaN;
}
