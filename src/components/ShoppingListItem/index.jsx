import "./ShoppingListItem.css";
import Icon from "../Icon";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   ShoppingListItem — item da compra atual. Stepper de
   quantidade (− / +), preço unitário e subtotal calculado em
   tempo real (subtotal = preço × quantidade). Remover item.
   Renderiza o conteúdo de um <li> (a lista usa <ul>/<li>).

   readOnly = true esconde stepper e remover (usado no detalhe
   de compra do histórico, que é imutável por RN10 do PRD).

   indisponivel = true marca o item como "produto não está no
   catálogo agora" (API offline). Subtotal vira "—", preço
   unitário some, e o item recebe estilo apagado. Stepper e
   remover continuam funcionais para o usuário poder limpar.
   ============================================================ */

export default function ShoppingListItem({
  nome,
  precoUnitario,
  quantidade,
  unidade,
  onIncrement,
  onDecrement,
  onRemove,
  readOnly = false,
  indisponivel = false,
}) {
  const subtotal = precoUnitario * quantidade;
  const classes = [
    "csm-listitem",
    indisponivel ? "csm-listitem--indisponivel" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classes}>
      <div className="csm-listitem__head">
        <p className="csm-listitem__name">{nome}</p>
        {indisponivel ? (
          <span className="csm-listitem__subtotal csm-listitem__subtotal--unknown" aria-label="Subtotal indisponível">—</span>
        ) : (
          <span className="csm-listitem__subtotal">{formatBRL(subtotal)}</span>
        )}
      </div>

      <div className="csm-listitem__controls">
        {readOnly ? (
          <span className="csm-listitem__qty-readonly">
            <span className="csm-listitem__qty-label">Qtd:</span> {quantidade}
          </span>
        ) : (
          <div className="csm-stepper" role="group" aria-label={`Quantidade de ${nome}`}>
            <button
              type="button"
              className="csm-stepper__btn"
              onClick={onDecrement}
              aria-label={`Diminuir quantidade de ${nome}`}
            >
              <Icon name="menos" size={18} />
            </button>
            <span className="csm-stepper__value" aria-live="polite">{quantidade}</span>
            <button
              type="button"
              className="csm-stepper__btn"
              onClick={onIncrement}
              aria-label={`Aumentar quantidade de ${nome}`}
            >
              <Icon name="mais" size={18} />
            </button>
          </div>
        )}

        {indisponivel ? (
          <span className="csm-listitem__unit csm-listitem__unit--unknown">
            Sem informações do catálogo
          </span>
        ) : (
          <span className="csm-listitem__unit">
            {formatBRL(precoUnitario)} <span className="csm-listitem__unit-label">/ {unidade}</span>
          </span>
        )}

        {!readOnly && (
          <button
            type="button"
            className="csm-listitem__remove"
            onClick={onRemove}
            aria-label={`Remover ${nome} da compra`}
          >
            <Icon name="lixeira" size={18} />
          </button>
        )}
      </div>
    </article>
  );
}
