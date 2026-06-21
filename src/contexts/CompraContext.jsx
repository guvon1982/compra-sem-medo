import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { compraReducer } from "./compraReducer";
import { carregarEstadoInicial, CHAVE_STORAGE } from "./carregarEstadoInicial";

/* ============================================================
   CompraContext — "caixa compartilhada" da compra atual, meta
   e historico de compras finalizadas. Consumido pelo hook
   `useCompra`.

   Carregamento resiliente (PRD risco "localStorage corromper
   estado"): a logica de leitura/validacao vive em
   `carregarEstadoInicial.js` (funcao pura, fora deste arquivo
   por causa do Fast Refresh). Se o storage for invalido, ela
   devolve { recuperadoComErro: true } e a UI avisa o usuario.
   ============================================================ */

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
      finalizarCompra: ({ total, itensDetalhados }) =>
        dispatch({
          type: "finalizarCompra",
          payload: { total, itensDetalhados, dataAtual: new Date() },
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
