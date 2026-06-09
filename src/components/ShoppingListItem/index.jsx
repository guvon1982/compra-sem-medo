import "./ShoppingListItem.css";
import Icon from "../Icon";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   ShoppingListItem — item da compra atual. Stepper de
   quantidade (− / +), preço unitário e subtotal calculado em
   tempo real (subtotal = preço × quantidade). Remover item.
   Renderiza o conteúdo de um <li> (a lista usa <ul>/<li>).
   ============================================================ */

export default function ShoppingListItem({
  nome,
  precoUnitario,
  quantidade,
  unidade,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const subtotal = precoUnitario * quantidade;

  return (
    <article className="csm-listitem">
      <div className="csm-listitem__head">
        <p className="csm-listitem__name">{nome}</p>
        <span className="csm-listitem__subtotal">{formatBRL(subtotal)}</span>
      </div>

      <div className="csm-listitem__controls">
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

        <span className="csm-listitem__unit">
          {formatBRL(precoUnitario)} <span className="csm-listitem__unit-label">/ {unidade}</span>
        </span>

        <button
          type="button"
          className="csm-listitem__remove"
          onClick={onRemove}
          aria-label={`Remover ${nome} da compra`}
        >
          <Icon name="lixeira" size={18} />
        </button>
      </div>
    </article>
  );
}
