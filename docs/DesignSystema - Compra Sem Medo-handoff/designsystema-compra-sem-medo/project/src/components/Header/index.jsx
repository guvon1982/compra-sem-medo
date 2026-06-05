import "./Header.css";
import Icon from "../Icon";
import Logo from "../Logo";

/* ============================================================
   Header — barra superior fixa. Na Home mostra o logo; nas
   demais telas mostra voltar + título. Ação opcional à direita.
   ============================================================ */

export default function Header({ title, onBack, action = null }) {
  return (
    <header className="csm-header">
      <div className="csm-header__left">
        {onBack ? (
          <>
            <button
              type="button"
              className="csm-header__back"
              onClick={onBack}
              aria-label="Voltar"
            >
              <Icon name="voltar" size={24} />
            </button>
            <h1 className="csm-header__title">{title}</h1>
          </>
        ) : (
          <Logo size={28} />
        )}
      </div>

      {action && <div className="csm-header__action">{action}</div>}
    </header>
  );
}
