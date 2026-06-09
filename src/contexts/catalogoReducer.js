/* ============================================================
   catalogoReducer — logica pura de como o catalogo de produtos
   muda em resposta a acoes. Sem React, sem fetch: e so uma
   funcao (estado, acao) => novoEstado.

   Estado:
   {
     produtos:    [ { id, nome, categoria, unidade, preco } ],
     carregando:  boolean,   // true durante a leitura inicial
     erro:        string | null,
   }

   Acoes:
   - iniciarCarregamento                       -> carregando=true, erro=null
   - definirProdutos({ produtos })             -> substitui produtos, carregando=false
   - definirErro({ erro })                     -> carregando=false, erro=<msg>
   - adicionarProduto({ produto })             -> insere produto (com id ja gerado pelo backend)
   - editarProduto({ id, dados })              -> aplica dados sobre o produto
   - removerProduto({ id })                    -> remove pelo id

   As acoes async (chamar fetch, esperar resposta) ficam no
   Provider; aqui so o efeito final no estado.
   ============================================================ */

export const estadoInicialCatalogo = {
  produtos: [],
  carregando: true,
  erro: null,
};

export function catalogoReducer(state, action) {
  switch (action.type) {
    case "iniciarCarregamento":
      return { ...state, carregando: true, erro: null };

    case "definirProdutos":
      return {
        ...state,
        produtos: action.payload.produtos,
        carregando: false,
        erro: null,
      };

    case "definirErro":
      return {
        ...state,
        carregando: false,
        erro: action.payload.erro,
      };

    case "adicionarProduto": {
      const { produto } = action.payload;
      return {
        ...state,
        produtos: [...state.produtos, produto],
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
