import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { compraReducer, estadoInicialCompra } from "./compraReducer";
import { lerDoStorage } from "../storage/useLocalStorage";

/* ============================================================
   CompraContext — "caixa compartilhada" da compra atual, meta
   e historico de compras finalizadas. Consumido pelo hook
   `useCompra`.
   ============================================================ */

const CHAVE_STORAGE = "csm:estado-compra";

const CompraContext = createContext(null);

export function CompraProvider({ children }) {
  const [state, dispatch] = useReducer(
    compraReducer,
    undefined,
    () => lerDoStorage(CHAVE_STORAGE, estadoInicialCompra),
  );

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
