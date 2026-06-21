import { COMPRA_INICIAL, META_INICIAL, HISTORICO } from "../data/mock";

/* ============================================================
   compraReducer — logica pura da compra ativa, da meta de
   gastos e do historico de compras finalizadas.

   Estado:
   {
     compraAtual:       [ { id, quantidade } ],   // itens da compra em andamento
     meta:              number | null,           // meta de gasto (opcional)
     historicoCompras:  [ { id, data, total, itens, meta } ]
                        // itens: array de snapshots (formato novo)
                        // ou number = contagem (formato legado, pre-feature F11)
   }

   Acoes suportadas:
   - adicionarItem({ produtoId })
       Se ja existe na compra, incrementa; senao, entra com quantidade 1.
   - incrementar({ id })            -> quantidade + 1
   - decrementar({ id })            -> quantidade - 1 (remove o item se chega a 0)
   - removerItem({ id })            -> tira o item da compra
   - definirMeta({ valor })         -> troca a meta de gasto
   - finalizarCompra({ total, itensDetalhados, dataAtual })
       Cria um registro no historico com total + snapshot completo dos itens
       (cada um com { id, nome, categoria, unidade, preco, quantidade }) +
       meta atual, e zera a compra. O snapshot e importante para o historico
       continuar legivel mesmo se um produto for editado/excluido depois
       (RN10 do PRD: historico imutavel). dataAtual e opcional (default =
       new Date()) e existe principalmente para o teste poder fixar a data.
   - excluirCompraHistorico({ id })
       Remove uma compra do historico pelo id. Stretch goal S4 do PRD —
       MVP tratava historico como imutavel (RN10), mas o stretch libera
       exclusao para o usuario poder limpar registros antigos.

   Acoes desconhecidas devolvem o estado intacto.
   ============================================================ */

export const estadoInicialCompra = {
  compraAtual: COMPRA_INICIAL,
  meta: META_INICIAL,
  historicoCompras: HISTORICO,
};

/* ============================================================
   validarEstadoCompra(obj) — diz se um objeto tem o shape
   esperado pelo reducer. Usado pelo CompraContext ao carregar
   o estado salvo no localStorage: se o objeto vier corrompido
   (versao antiga, edicao manual, bug em fase futura), caimos
   no estadoInicialCompra em vez de quebrar a UI.

   Regras (PRD: "Validar formato ao carregar; se invalido,
   resetar com aviso ao usuario."):
   - precisa ser objeto
   - compraAtual: array de { id: string, quantidade: number }
   - meta: null ou number > 0
   - historicoCompras: array (entradas validamos de leve, pra
     nao perder o historico inteiro se um registro vier torto)
   ============================================================ */
export function validarEstadoCompra(obj) {
  if (!obj || typeof obj !== "object") return false;

  if (!Array.isArray(obj.compraAtual)) return false;
  for (const item of obj.compraAtual) {
    if (!item || typeof item.id !== "string") return false;
    if (typeof item.quantidade !== "number" || item.quantidade <= 0) return false;
  }

  const metaValida =
    obj.meta === null ||
    (typeof obj.meta === "number" && obj.meta > 0);
  if (!metaValida) return false;

  if (!Array.isArray(obj.historicoCompras)) return false;

  return true;
}

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

    case "excluirCompraHistorico": {
      const { id } = action.payload;
      return {
        ...state,
        historicoCompras: state.historicoCompras.filter((c) => c.id !== id),
      };
    }

    case "finalizarCompra": {
      const { total, itensDetalhados, dataAtual } = action.payload;
      const registro = {
        id: `h-${Date.now()}`,
        data: formatarData(dataAtual ?? new Date()),
        total,
        itens: itensDetalhados,
        meta: state.meta,
      };
      // RN9 do PRD: ao finalizar, zera compraAtual E meta. A meta do
      // registro acima ja salvou o valor que estava ativo — agora a
      // nova compra comeca sem meta, como uma ida ao mercado nova.
      return {
        ...state,
        historicoCompras: [registro, ...state.historicoCompras],
        compraAtual: [],
        meta: null,
      };
    }

    default:
      return state;
  }
}
