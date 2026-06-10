import { useNavigate } from "react-router";
import "./Home.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import BudgetProgress from "../../components/BudgetProgress";
import Card from "../../components/Card";
import Button from "../../components/Button";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import AlertMessage from "../../components/AlertMessage";
import { useCatalogo } from "../../contexts/CatalogoContext";
import { useCompra } from "../../contexts/CompraContext";

/* ============================================================
   Home (/) — apresenta o app, mostra a compra em andamento
   (total + meta) se houver, e atalhos para Cadastro e Compra.
   Estado vazio amigavel quando nao ha compra.

   Agora consome a compra e o catalogo dos contextos: o que
   aparece aqui reflete o que esta acontecendo na Listagem.
   ============================================================ */

function totalDaCompra(itens) {
  return itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0);
}

function totalDeItens(itens) {
  return itens.reduce((soma, item) => soma + item.quantidade, 0);
}

export default function Home() {
  const navigate = useNavigate();
  const { produtos, carregando, erro } = useCatalogo();
  const { compraAtual, meta } = useCompra();

  // Junta cada entrada da compra (id + quantidade) com os dados do produto.
  const itensDaCompra = compraAtual
    .map((entrada) => {
      const produto = produtos.find((p) => p.id === entrada.id);
      return produto ? { ...produto, quantidade: entrada.quantidade } : null;
    })
    .filter(Boolean);

  const hasPurchase = itensDaCompra.length > 0;
  const total = totalDaCompra(itensDaCompra);
  const itemCount = totalDeItens(itensDaCompra);
  const budget = meta;

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

          {/* erro de rede do catalogo, se houver */}
          {erro && (
            <AlertMessage variant="error" title="Não foi possível carregar o catálogo">
              {erro}
            </AlertMessage>
          )}

          {/* compra em andamento OU estado vazio (com fallback de carregamento) */}
          {carregando ? (
            <Card padding="none">
              <EmptyState
                icon="carrinho"
                title="Carregando catálogo..."
                description="Buscando os produtos no servidor."
              />
            </Card>
          ) : hasPurchase ? (
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
