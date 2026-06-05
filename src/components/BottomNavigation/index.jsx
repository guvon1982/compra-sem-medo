import { NavLink } from "react-router";
import "./BottomNavigation.css";
import Icon from "../Icon";

/* ============================================================
   BottomNavigation — navegacao fixa no rodape (3 destinos).
   Usa <NavLink> do react-router: ele aplica a classe quando a
   rota bate (`isActive`) e ja deixa o link em alvo ≥ 44px.
   O item ativo recebe a classe `is-active` e a marca azul.
   ============================================================ */

const ITEMS = [
  { to: "/", label: "Início", icon: "casa", end: true },
  { to: "/cadastro", label: "Cadastrar", icon: "mais" },
  { to: "/listagem", label: "Compra", icon: "carrinho" },
];

export default function BottomNavigation() {
  return (
    <nav className="csm-bottomnav" aria-label="Navegação principal">
      <ul className="csm-bottomnav__list">
        {ITEMS.map((item) => (
          <li key={item.to} className="csm-bottomnav__item">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `csm-bottomnav__link${isActive ? " is-active" : ""}`
              }
              aria-label={item.label}
            >
              <Icon name={item.icon} size={24} />
              <span className="csm-bottomnav__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
