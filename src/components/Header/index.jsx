import "./Header.css";
import Icon from "../Icon";
import Logo from "../Logo";

/* ============================================================
   Header — barra superior fixa.
   - Sem `title` -> mostra a marca (Logo). Usado na Home.
   - Com `title` -> mostra o titulo da tela (h1). Se `onBack`
     vier junto, mostra tambem o botao de voltar a esquerda.
   - `action` opcional fica a direita (ex.: atalho para Cadastro).
   ============================================================ */

export default function Header({ title, onBack, action = null }) {
  const hasTitle = Boolean(title);

  return (
    <header className="csm-header">
      <div className="csm-header__left">
        {hasTitle ? (
          <>
            {onBack && (
              <button
                type="button"
                className="csm-header__back"
                onClick={onBack}
                aria-label="Voltar"
              >
                <Icon name="voltar" size={24} />
              </button>
            )}
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
