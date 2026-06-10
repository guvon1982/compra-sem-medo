import "./ProductItem.css";
import Icon from "../Icon";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   ProductItem — produto no catálogo. Mostra nome, categoria/
   unidade e preço; ação de adicionar à compra. Quando já está
   na compra, o botão vira estado "adicionado".
   ============================================================ */

export default function ProductItem({
  nome,
  categoria,
  unidade,
  preco,
  icon = null,
  added = false,
  onAdd,
}) {
  return (
    <article className="csm-product">
      {icon && <span className="csm-product__icon" aria-hidden="true">{icon}</span>}

      <div className="csm-product__info">
        <p className="csm-product__name">{nome}</p>
        <p className="csm-product__meta">
          {categoria} · {unidade}
        </p>
      </div>

      <div className="csm-product__right">
        <span className="csm-product__price">{formatBRL(preco)}</span>
        <button
          type="button"
          className={`csm-product__add ${added ? "is-added" : ""}`}
          onClick={onAdd}
          aria-label={added ? `${nome} já está na compra. Adicionar mais um` : `Adicionar ${nome} à compra`}
        >
          <Icon name={added ? "check" : "mais"} size={20} />
        </button>
      </div>
    </article>
  );
}
