import "./EmptyState.css";
import Icon from "../Icon";

/* ============================================================
   EmptyState — vazio amigável (catálogo, lista ou histórico).
   `icon` aceita nome do Icon (string) ou um nó pronto.
   `action` é opcional (ex.: um <Button>).
   ============================================================ */

export default function EmptyState({ icon = "carrinho", title, description, action }) {
  return (
    <div className="csm-empty">
      <span className="csm-empty__icon" aria-hidden="true">
        {typeof icon === "string" ? <Icon name={icon} size={32} /> : icon}
      </span>
      {title && <p className="csm-empty__title">{title}</p>}
      {description && <p className="csm-empty__desc">{description}</p>}
      {action && <div className="csm-empty__action">{action}</div>}
    </div>
  );
}
