import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { catalogoReducer, estadoInicialCatalogo } from "./catalogoReducer";
import * as produtoService from "../services/produtoService";

/* ============================================================
   CatalogoContext — "caixa compartilhada" do catalogo de
   produtos. Le do json-server na montagem inicial e expoe
   acoes async (criar/editar/remover) que tambem batem na API.

   Estado exposto: { produtos, carregando, erro } + acoes.

   Quem chama uma acao async pode `await` para saber quando
   terminou (util pro Cadastro mostrar erro de rede no form).
   ============================================================ */

const CatalogoContext = createContext(null);

export function CatalogoProvider({ children }) {
  const [state, dispatch] = useReducer(catalogoReducer, estadoInicialCatalogo);

  // Carregamento inicial: chama listar() uma unica vez na montagem.
  // A flag `cancelado` evita atualizar estado se o componente desmontar
  // antes da resposta chegar (cleanup do useEffect).
  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      dispatch({ type: "iniciarCarregamento" });
      const resposta = await produtoService.listar();
      if (cancelado) return;

      if (resposta?.message && !Array.isArray(resposta)) {
        dispatch({ type: "definirErro", payload: { erro: resposta.message } });
      } else {
        dispatch({ type: "definirProdutos", payload: { produtos: resposta } });
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      produtos: state.produtos,
      carregando: state.carregando,
      erro: state.erro,

      adicionarProduto: async (dados) => {
        const criado = await produtoService.criar(dados);
        if (criado?.message && !criado?.id) {
          throw new Error(criado.message);
        }
        dispatch({ type: "adicionarProduto", payload: { produto: criado } });
        return criado;
      },

      editarProduto: async (id, dados) => {
        const atualizado = await produtoService.atualizar({ id, ...dados });
        if (atualizado?.message && !atualizado?.id) {
          throw new Error(atualizado.message);
        }
        dispatch({ type: "editarProduto", payload: { id, dados: atualizado } });
        return atualizado;
      },

      removerProduto: async (id) => {
        const resp = await produtoService.remover({ id });
        // json-server pode devolver {} ou o objeto removido no sucesso.
        // O service so devolve `message` quando ha erro de rede/excecao,
        // entao a presenca desse campo (sem id) ja indica falha.
        if (resp?.message && !resp?.id) {
          throw new Error(resp.message);
        }
        dispatch({ type: "removerProduto", payload: { id } });
      },
    }),
    [state.produtos, state.carregando, state.erro],
  );

  return (
    <CatalogoContext.Provider value={value}>
      {children}
    </CatalogoContext.Provider>
  );
}

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
