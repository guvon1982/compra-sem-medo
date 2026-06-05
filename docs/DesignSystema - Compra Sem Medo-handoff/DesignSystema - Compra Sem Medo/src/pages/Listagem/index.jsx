import "./Listagem.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import BudgetProgress from "../../components/BudgetProgress";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import ProductItem from "../../components/ProductItem";
import ShoppingListItem from "../../components/ShoppingListItem";
import AlertMessage from "../../components/AlertMessage";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import { ICONE_CATEGORIA, CATEGORIAS } from "../../data/mock";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   Listagem (/listagem) — tela combinada em 3 abas:
   • Minha compra: itens com subtotal + total/meta + finalizar
   • Catálogo: produtos para adicionar (busca + por categoria)
   • Histórico: compras anteriores
   O herói (total) fica fixo no topo nas abas de compra/catálogo.
   ============================================================ */

const TABS = [
  { key: "compra", label: "Minha compra" },
  { key: "catalogo", label: "Catálogo" },
  { key: "historico", label: "Histórico" },
];

export default function Listagem({
  products = [],
  list = [],
  budget = null,
  total = 0,
  itemCount = 0,
  historico = [],
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
  onFinalize,
  onSetBudget,
  onNavigate,
}) {
  const [tab, setTab] = React.useState("compra");
  const [busca, setBusca] = React.useState("");
  const [confirmar, setConfirmar] = React.useState(false);
  const [finalizada, setFinalizada] = React.useState(null);

  const over = budget != null && total > budget;
  const addedIds = new Set(list.map((i) => i.id));

  const filtrados = products.filter((p) =>
    p.name.toLowerCase().includes(busca.trim().toLowerCase())
  );

  function confirmarFinalizar() {
    setConfirmar(false);
    setFinalizada({ total, itens: itemCount });
    onFinalize && onFinalize();
    setTab("historico");
  }

  return (
    <div className="csm-screen csm-listagem">
      <Header
        title="Compra"
        action={
          <Button variant="ghost" size="sm" onClick={() => onNavigate && onNavigate("cadastro")}
                  iconLeft={<Icon name="mais" size={18} />}>
            Produto
          </Button>
        }
      />

      <main className="csm-screen__main">
        {/* abas (sticky) */}
        <div className="csm-tabs" role="tablist" aria-label="Seções da compra">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`csm-tabs__tab ${tab === t.key ? "is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* herói fixo (compra/catálogo) */}
        {tab !== "historico" && (
          <div className="csm-listagem__hero">
            <BudgetProgress total={total} budget={budget} itemCount={itemCount}
                            onSetBudget={onSetBudget} />
          </div>
        )}

        {/* ---- ABA: MINHA COMPRA ---- */}
        {tab === "compra" && (
          <div className="csm-content">
            {finalizada && (
              <AlertMessage variant="success" title="Compra finalizada!"
                            onClose={() => setFinalizada(null)}>
                {formatBRL(finalizada.total)} em {finalizada.itens}{" "}
                {finalizada.itens === 1 ? "item" : "itens"}. Salvamos no seu histórico.
              </AlertMessage>
            )}

            {over && (
              <AlertMessage variant="alert" title="Atenção: meta excedida">
                Você passou {formatBRL(total - budget)} da meta. Dá para tirar algo do carrinho?
              </AlertMessage>
            )}

            {list.length === 0 ? (
              <EmptyState
                icon="carrinho"
                title="Sua lista está vazia"
                description="Que tal começar adicionando um produto do catálogo?"
                action={
                  <Button variant="primary" onClick={() => setTab("catalogo")}
                          iconLeft={<Icon name="mais" size={20} />}>
                    Ver catálogo
                  </Button>
                }
              />
            ) : (
              <>
                <Card padding="none">
                  <ul className="csm-divided">
                    {list.map((item) => (
                      <li key={item.id}>
                        <ShoppingListItem
                          name={item.name}
                          unitPrice={item.price}
                          quantity={item.quantity}
                          unit={item.unit}
                          onIncrement={() => onIncrement && onIncrement(item.id)}
                          onDecrement={() => onDecrement && onDecrement(item.id)}
                          onRemove={() => onRemove && onRemove(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </Card>

                <Button variant="primary" size="lg" fullWidth
                        iconLeft={<Icon name="check-circulo" size={20} />}
                        onClick={() => setConfirmar(true)}>
                  Finalizar compra
                </Button>
              </>
            )}
          </div>
        )}

        {/* ---- ABA: CATÁLOGO ---- */}
        {tab === "catalogo" && (
          <div className="csm-content">
            <Input
              label="Buscar produto"
              placeholder="Buscar no catálogo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              prefix={<Icon name="busca" size={18} />}
            />

            {filtrados.length === 0 ? (
              <EmptyState
                icon="busca"
                title="Nada encontrado"
                description={`Não achamos produtos para “${busca}”. Você pode cadastrar um novo.`}
                action={
                  <Button variant="secondary" onClick={() => onNavigate && onNavigate("cadastro")}
                          iconLeft={<Icon name="mais" size={20} />}>
                    Cadastrar produto
                  </Button>
                }
              />
            ) : (
              CATEGORIAS.map((cat) => {
                const doGrupo = filtrados.filter((p) => p.category === cat);
                if (doGrupo.length === 0) return null;
                return (
                  <section key={cat} aria-label={cat}>
                    <p className="csm-section-label csm-listagem__cat">{cat}</p>
                    <Card padding="none">
                      <ul className="csm-divided">
                        {doGrupo.map((p) => (
                          <li key={p.id}>
                            <ProductItem
                              name={p.name}
                              category={p.category}
                              unit={p.unit}
                              price={p.price}
                              added={addedIds.has(p.id)}
                              icon={<Icon name={ICONE_CATEGORIA[p.category] || "caixa"} size={20} />}
                              onAdd={() => onAdd && onAdd(p.id)}
                            />
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </section>
                );
              })
            )}
          </div>
        )}

        {/* ---- ABA: HISTÓRICO ---- */}
        {tab === "historico" && (
          <div className="csm-content">
            {historico.length === 0 ? (
              <EmptyState
                icon="historico"
                title="Nenhuma compra anterior"
                description="Quando você finalizar uma compra, ela aparece aqui."
              />
            ) : (
              <ul className="csm-listagem__hist">
                {historico.map((h) => {
                  const passou = h.meta != null && h.total > h.meta;
                  return (
                    <li key={h.id}>
                      <Card padding="md" className="csm-hist">
                        <div className="csm-hist__top">
                          <span className="csm-hist__date">{h.data}</span>
                          {h.meta != null && (
                            <span className={`csm-hist__chip ${passou ? "is-over" : "is-ok"}`}>
                              {passou ? "Passou da meta" : "Dentro da meta"}
                            </span>
                          )}
                        </div>
                        <div className="csm-hist__bottom">
                          <span className="csm-hist__total">{formatBRL(h.total)}</span>
                          <span className="csm-hist__items">
                            {h.itens} {h.itens === 1 ? "item" : "itens"}
                          </span>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </main>

      <BottomNavigation active="listagem" onNavigate={onNavigate} />

      {/* ---- Confirmação de finalizar ---- */}
      {confirmar && (
        <div className="csm-modal" role="dialog" aria-modal="true" aria-labelledby="csm-modal-title">
          <div className="csm-modal__backdrop" onClick={() => setConfirmar(false)} />
          <Card padding="lg" className="csm-modal__card">
            <span className="csm-modal__icon"><Icon name="check-circulo" size={28} /></span>
            <h2 className="csm-modal__title" id="csm-modal-title">Finalizar esta compra?</h2>
            <p className="csm-modal__text">
              Tem certeza que quer finalizar? O total de <strong>{formatBRL(total)}</strong> vai
              para o histórico e a compra atual será zerada.
            </p>
            <div className="csm-modal__actions">
              <Button variant="primary" size="lg" fullWidth onClick={confirmarFinalizar}>
                Sim, finalizar
              </Button>
              <Button variant="ghost" size="md" fullWidth onClick={() => setConfirmar(false)}>
                Continuar comprando
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
