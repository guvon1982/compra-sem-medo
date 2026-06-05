import { PRODUTOS } from "../data/mock";

/* ============================================================
   catalogoReducer — logica pura de como o catalogo de produtos
   muda em resposta a acoes. Sem React aqui: e so uma funcao
   (estado, acao) => novoEstado.

   Estado: { produtos: [ { id, name, category, unit, price } ] }

   Acoes suportadas:
   - adicionarProduto({ produto })  -> insere produto novo (gera id se nao veio)
   - editarProduto({ id, dados })   -> aplica `dados` sobre o produto com aquele id
   - removerProduto({ id })         -> remove o produto pelo id

   Acoes desconhecidas devolvem o estado intacto, padrao de
   reducer (defensivo).
   ============================================================ */

export const estadoInicialCatalogo = {
  produtos: PRODUTOS,
};

export function catalogoReducer(state, action) {
  switch (action.type) {
    case "adicionarProduto": {
      const { produto } = action.payload;
      // se quem chamou nao passou id, geramos um baseado em timestamp.
      // No MVP isso e suficiente; em producao usariamos uuid ou o id do backend.
      const id = produto.id ?? `p${Date.now()}`;
      return {
        ...state,
        produtos: [...state.produtos, { ...produto, id }],
      };
    }

    case "editarProduto": {
      const { id, dados } = action.payload;
      return {
        ...state,
        produtos: state.produtos.map((p) =>
          p.id === id ? { ...p, ...dados } : p,
        ),
      };
    }

    case "removerProduto": {
      const { id } = action.payload;
      return {
        ...state,
        produtos: state.produtos.filter((p) => p.id !== id),
      };
    }

    default:
      return state;
  }
}
