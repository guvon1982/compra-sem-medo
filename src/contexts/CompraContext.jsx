import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import {
  compraReducer,
  estadoInicialCompra,
  validarEstadoCompra,
} from "./compraReducer";

/* ============================================================
   CompraContext — "caixa compartilhada" da compra atual, meta
   e historico de compras finalizadas. Consumido pelo hook
   `useCompra`.

   Carregamento resiliente (PRD risco "localStorage corromper
   estado"): tenta ler o estado salvo, valida o shape via
   validarEstadoCompra; se for invalido, cai no estadoInicial
   e expoe `erroStorage = true` para que a UI possa avisar.
   ============================================================ */

export const CHAVE_STORAGE = "csm:estado-compra";

// Funcao pura: decide o que usar como estado inicial olhando o
// localStorage. Roda uma unica vez via lazy initializer do useState.
//
// Distingue tres cenarios:
//   1. chave nao existe -> primeira visita, usa o seed, sem aviso
//   2. chave existe mas JSON quebrado -> usa o seed, aviso
//   3. JSON valido mas shape errado -> usa o seed, aviso
// Os casos 2 e 3 sao os que o PRD pede para "resetar com aviso".
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

const CompraContext = createContext(null);

export function CompraProvider({ children }) {
  // useState com funcao garante que carregarEstadoInicial roda so na 1a render.
  const [{ estado: estadoInit, recuperadoComErro }] = useState(carregarEstadoInicial);
  const [state, dispatch] = useReducer(compraReducer, estadoInit);
  const [erroStorage, setErroStorage] = useState(recuperadoComErro);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(state));
    } catch {
      // silencia erros de modo privado ou storage cheio
    }
  }, [state]);

  const value = useMemo(
    () => ({
      compraAtual: state.compraAtual,
      meta: state.meta,
      historicoCompras: state.historicoCompras,
      erroStorage,
      descartarErroStorage: () => setErroStorage(false),
      adicionarItem: (produtoId) =>
        dispatch({ type: "adicionarItem", payload: { produtoId } }),
      incrementar: (id) =>
        dispatch({ type: "incrementar", payload: { id } }),
      decrementar: (id) =>
        dispatch({ type: "decrementar", payload: { id } }),
      removerItem: (id) =>
        dispatch({ type: "removerItem", payload: { id } }),
      definirMeta: (valor) =>
        dispatch({ type: "definirMeta", payload: { valor } }),
      finalizarCompra: ({ total, itens }) =>
        dispatch({
          type: "finalizarCompra",
          payload: { total, itens, dataAtual: new Date() },
        }),
    }),
    [state.compraAtual, state.meta, state.historicoCompras, erroStorage],
  );

  return (
    <CompraContext.Provider value={value}>{children}</CompraContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompra() {
  const ctx = useContext(CompraContext);
  if (!ctx) {
    throw new Error("useCompra precisa estar dentro de <CompraProvider>.");
  }
  return ctx;
}
