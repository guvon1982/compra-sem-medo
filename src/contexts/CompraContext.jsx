import { createContext, useContext, useMemo, useReducer } from "react";
import { compraReducer, estadoInicialCompra } from "./compraReducer";

/* ============================================================
   CompraContext — "caixa compartilhada" da compra atual, meta
   e historico de compras finalizadas. Consumido pelo hook
   `useCompra`.
   ============================================================ */

const CompraContext = createContext(null);

export function CompraProvider({ children }) {
  const [state, dispatch] = useReducer(compraReducer, estadoInicialCompra);

  const value = useMemo(
    () => ({
      compraAtual: state.compraAtual,
      meta: state.meta,
      historicoCompras: state.historicoCompras,
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
    [state.compraAtual, state.meta, state.historicoCompras],
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
