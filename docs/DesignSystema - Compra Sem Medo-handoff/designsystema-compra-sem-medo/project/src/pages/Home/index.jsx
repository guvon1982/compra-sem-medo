import "./Home.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import BudgetProgress from "../../components/BudgetProgress";
import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";

/* ============================================================
   Home (/) — apresenta o app, mostra a compra em andamento
   (total + meta) se houver, e atalhos para Cadastro e Compra.
   Estado vazio amigável quando não há compra.
   ============================================================ */

export default function Home({
  hasPurchase = false,
  total = 0,
  budget = null,
  itemCount = 0,
  onNavigate,
}) {
  const go = (key) => onNavigate && onNavigate(key);

  return (
    <div className="csm-screen">
      <Header />

      <main className="csm-screen__main">
        <div className="csm-content">
          {/* tagline da marca */}
          <section className="csm-home__intro">
            <p className="csm-home__tagline">
              Sua compra sob controle, <strong>sem susto no caixa.</strong>
            </p>
            <p className="csm-home__sub">
              Acompanhe o total em tempo real enquanto coloca os produtos no carrinho.
            </p>
          </section>

          {/* compra em andamento OU estado vazio */}
          {hasPurchase ? (
            <section aria-label="Compra em andamento">
              <p className="csm-section-label csm-home__above">Compra em andamento</p>
              <Card padding="none" className="csm-home__current">
                <BudgetProgress total={total} budget={budget} itemCount={itemCount} />
                <div className="csm-home__current-action">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconRight={<Icon name="avancar" size={20} />}
                    onClick={() => go("listagem")}
                  >
                    Continuar compra
                  </Button>
                </div>
              </Card>
            </section>
          ) : (
            <Card padding="none">
              <EmptyState
                icon="carrinho"
                title="Nenhuma compra em andamento"
                description="Que tal começar? Monte sua lista e veja o total crescer em tempo real."
                action={
                  <Button variant="primary" size="lg" onClick={() => go("listagem")}
                          iconLeft={<Icon name="mais" size={20} />}>
                    Iniciar compra
                  </Button>
                }
              />
            </Card>
          )}

          {/* atalhos */}
          <section aria-label="Atalhos">
            <p className="csm-section-label csm-home__above">Atalhos</p>
            <ul className="csm-home__shortcuts">
              <li>
                <Card as="button" interactive padding="md" className="csm-home__shortcut"
                      onClick={() => go("cadastro")}>
                  <span className="csm-home__shortcut-icon csm-home__shortcut-icon--blue">
                    <Icon name="mais" size={24} />
                  </span>
                  <span className="csm-home__shortcut-text">
                    <span className="csm-home__shortcut-title">Cadastrar produto</span>
                    <span className="csm-home__shortcut-desc">Adicione um item ao catálogo</span>
                  </span>
                  <Icon name="avancar" size={20} className="csm-home__shortcut-chev" />
                </Card>
              </li>
              <li>
                <Card as="button" interactive padding="md" className="csm-home__shortcut"
                      onClick={() => go("listagem")}>
                  <span className="csm-home__shortcut-icon csm-home__shortcut-icon--green">
                    <Icon name="carrinho" size={24} />
                  </span>
                  <span className="csm-home__shortcut-text">
                    <span className="csm-home__shortcut-title">Ver catálogo e compra</span>
                    <span className="csm-home__shortcut-desc">Monte sua lista e finalize</span>
                  </span>
                  <Icon name="avancar" size={20} className="csm-home__shortcut-chev" />
                </Card>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <BottomNavigation active="home" onNavigate={onNavigate} />
    </div>
  );
}
