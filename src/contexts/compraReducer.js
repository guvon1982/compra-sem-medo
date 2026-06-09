import { COMPRA_INICIAL, META_INICIAL, HISTORICO } from "../data/mock";

/* ============================================================
   compraReducer — logica pura da compra ativa, da meta de
   gastos e do historico de compras finalizadas.

   Estado:
   {
     compraAtual:       [ { id, quantidade } ],   // itens da compra em andamento
     meta:              number | null,           // meta de gasto (opcional)
     historicoCompras:  [ { id, data, total, itens, meta } ]
   }

   Acoes suportadas:
   - adicionarItem({ produtoId })
       Se ja existe na compra, incrementa; senao, entra com quantidade 1.
   - incrementar({ id })            -> quantidade + 1
   - decrementar({ id })            -> quantidade - 1 (remove o item se chega a 0)
   - removerItem({ id })            -> tira o item da compra
   - definirMeta({ valor })         -> troca a meta de gasto
   - finalizarCompra({ total, itens, dataAtual })
       Cria um registro no historico com total/itens (calculados pelo
       componente, que junta compraAtual com o catalogo) + meta atual,
       e zera a compra. dataAtual e opcional (default = new Date()) e
       existe principalmente para o teste poder fixar a data.

   Acoes desconhecidas devolvem o estado intacto.
   ============================================================ */

export const estadoInicialCompra = {
  compraAtual: COMPRA_INICIAL,
  meta: META_INICIAL,
  historicoCompras: HISTORICO,
};

function formatarData(date) {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function compraReducer(state, action) {
  switch (action.type) {
    case "adicionarItem": {
      const { produtoId } = action.payload;
      const jaExiste = state.compraAtual.find((e) => e.id === produtoId);
      if (jaExiste) {
        return {
          ...state,
          compraAtual: state.compraAtual.map((e) =>
            e.id === produtoId ? { ...e, quantidade: e.quantidade + 1 } : e,
          ),
        };
      }
      return {
        ...state,
        compraAtual: [...state.compraAtual, { id: produtoId, quantidade: 1 }],
      };
    }

    case "incrementar": {
      const { id } = action.payload;
      return {
        ...state,
        compraAtual: state.compraAtual.map((e) =>
          e.id === id ? { ...e, quantidade: e.quantidade + 1 } : e,
        ),
      };
    }

    case "decrementar": {
      const { id } = action.payload;
      return {
        ...state,
        compraAtual: state.compraAtual
          .map((e) => (e.id === id ? { ...e, quantidade: e.quantidade - 1 } : e))
          .filter((e) => e.quantidade > 0),
      };
    }

    case "removerItem": {
      const { id } = action.payload;
      return {
        ...state,
        compraAtual: state.compraAtual.filter((e) => e.id !== id),
      };
    }

    case "definirMeta": {
      const { valor } = action.payload;
      return { ...state, meta: valor };
    }

    case "finalizarCompra": {
      const { total, itens, dataAtual } = action.payload;
      const registro = {
        id: `h-${Date.now()}`,
        data: formatarData(dataAtual ?? new Date()),
        total,
        itens,
        meta: state.meta,
      };
      return {
        ...state,
        historicoCompras: [registro, ...state.historicoCompras],
        compraAtual: [],
      };
    }

    default:
      return state;
  }
}
