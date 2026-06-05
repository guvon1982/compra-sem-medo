import { createContext, useContext, useMemo, useReducer } from "react";
import { catalogoReducer, estadoInicialCatalogo } from "./catalogoReducer";

/* ============================================================
   CatalogoContext — "caixa compartilhada" do catalogo de
   produtos. Qualquer pagina dentro do <CatalogoProvider>
   consegue ler `produtos` e despachar acoes (adicionar/editar/
   remover) atraves do hook `useCatalogo`.
   ============================================================ */

const CatalogoContext = createContext(null);

export function CatalogoProvider({ children }) {
  const [state, dispatch] = useReducer(catalogoReducer, estadoInicialCatalogo);

  // useMemo evita criar um objeto novo a cada render — sem isso, todo
  // componente que consome o contexto rerenderizaria mesmo sem mudanca real.
  const value = useMemo(
    () => ({
      produtos: state.produtos,
      adicionarProduto: (produto) =>
        dispatch({ type: "adicionarProduto", payload: { produto } }),
      editarProduto: (id, dados) =>
        dispatch({ type: "editarProduto", payload: { id, dados } }),
      removerProduto: (id) =>
        dispatch({ type: "removerProduto", payload: { id } }),
    }),
    [state.produtos],
  );

  return (
    <CatalogoContext.Provider value={value}>
      {children}
    </CatalogoContext.Provider>
  );
}

// Hook que esconde o useContext + valida que estamos dentro do Provider.
// O comentario `eslint-disable` abaixo desliga, so para essa linha, uma
// regra do Fast Refresh do Vite que pede "1 arquivo = 1 componente". No
// contexto e aceitavel porque hook e provider andam juntos.
// eslint-disable-next-line react-refresh/only-export-components
export function useCatalogo() {
  const ctx = useContext(CatalogoContext);
  if (!ctx) {
    throw new Error(
      "useCatalogo precisa estar dentro de <CatalogoProvider>.",
    );
  }
  return ctx;
}
