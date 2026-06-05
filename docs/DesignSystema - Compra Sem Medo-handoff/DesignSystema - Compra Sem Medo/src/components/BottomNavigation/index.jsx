import "./BottomNavigation.css";
import Icon from "../Icon";

/* ============================================================
   BottomNavigation — navegação fixa no rodapé (3 destinos).
   Alvos ≥ 44px, item ativo com aria-current. A cor entra só no
   item ativo; os demais ficam neutros.
   ============================================================ */

const ITEMS = [
  { key: "home", label: "Início", icon: "casa" },
  { key: "cadastro", label: "Cadastrar", icon: "mais" },
  { key: "listagem", label: "Compra", icon: "carrinho" },
];

export default function BottomNavigation({ active = "home", onNavigate }) {
  return (
    <nav className="csm-bottomnav" aria-label="Navegação principal">
      <ul className="csm-bottomnav__list">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key} className="csm-bottomnav__item">
              <button
                type="button"
                className={`csm-bottomnav__link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onNavigate && onNavigate(item.key)}
              >
                <Icon name={item.icon} size={24} />
                <span className="csm-bottomnav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
