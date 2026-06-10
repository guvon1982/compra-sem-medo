import { estadoInicialCompra, validarEstadoCompra } from "./compraReducer";

/* ============================================================
   carregarEstadoInicial — funcao pura usada pelo CompraContext
   como lazy initializer do estado. Mora num arquivo separado
   por dois motivos:

   - facilita o teste isolado (sem React no caminho);
   - mantem CompraContext.jsx exportando apenas componentes/hooks
     React, o que e exigencia do react-refresh para Fast Refresh.

   Distingue 3 cenarios ao ler o localStorage:
     1. chave nao existe -> primeira visita, usa seed, sem aviso
     2. chave existe mas JSON quebrado -> usa seed, COM aviso
     3. JSON valido mas shape errado -> usa seed, COM aviso

   Os casos 2 e 3 cumprem o requisito do PRD de "validar formato
   ao carregar; se invalido, resetar com aviso ao usuario".
   ============================================================ */

export const CHAVE_STORAGE = "csm:estado-compra";

export function carregarEstadoInicial() {
  let raw;
  try {
    raw = localStorage.getItem(CHAVE_STORAGE);
  } catch {
    // localStorage indisponivel (modo privado, etc.) — trata como primeira visita
    return { estado: estadoInicialCompra, recuperadoComErro: false };
  }

  if (raw === null) {
    return { estado: estadoInicialCompra, recuperadoComErro: false };
  }

  let parseado;
  try {
    parseado = JSON.parse(raw);
  } catch {
    return { estado: estadoInicialCompra, recuperadoComErro: true };
  }

  if (validarEstadoCompra(parseado)) {
    return { estado: parseado, recuperadoComErro: false };
  }

  return { estado: estadoInicialCompra, recuperadoComErro: true };
}
