import { useNavigate } from "react-router";
import "./Home.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import BudgetProgress from "../../components/BudgetProgress";
import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import {
  PRODUTOS,
  COMPRA_INICIAL,
  META_INICIAL,
} from "../../data/mock";

/* ============================================================
   Home (/) — apresenta o app, mostra a compra em andamento
   (total + meta) se houver, e atalhos para Cadastro e Compra.
   Estado vazio amigavel quando nao ha compra.

   MVP visual: deriva total/itens diretamente da compra mock.
   Na proxima feature, esses valores virao do Context (compra
   compartilhada entre paginas).
   ============================================================ */

function totalDaCompra(itens) {
  return itens.reduce((soma, item) => soma + item.price * item.quantity, 0);
}

function totalDeItens(itens) {
  return itens.reduce((soma, item) => soma + item.quantity, 0);
}

export default function Home() {
  const navigate = useNavigate();

  // Junta as quantidades de COMPRA_INICIAL com os dados do PRODUTO correspondente
  const itensDaCompra = COMPRA_INICIAL
    .map((entrada) => {
      const produto = PRODUTOS.find((p) => p.id === entrada.id);
      return produto ? { ...produto, quantity: entrada.quantity } : null;
    })
    .filter(Boolean);

  const hasPurchase = itensDaCompra.length > 0;
  const total = totalDaCompra(itensDaCompra);
  const itemCount = totalDeItens(itensDaCompra);
  const budget = META_INICIAL;

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
                    onClick={() => navigate("/listagem")}
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
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate("/listagem")}
                    iconLeft={<Icon name="mais" size={20} />}
                  >
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
                <Card
                  as="button"
                  interactive
                  padding="md"
                  className="csm-home__shortcut"
                  onClick={() => navigate("/cadastro")}
                >
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
                <Card
                  as="button"
                  interactive
                  padding="md"
                  className="csm-home__shortcut"
                  onClick={() => navigate("/listagem")}
                >
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

      <BottomNavigation />
    </div>
  );
}
