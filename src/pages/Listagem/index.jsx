import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
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
import {
  PRODUTOS,
  CATEGORIAS,
  ICONE_CATEGORIA,
  COMPRA_INICIAL,
  META_INICIAL,
  HISTORICO,
} from "../../data/mock";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   Listagem (/listagem) — tela combinada em 3 abas:
   • Minha compra: itens com subtotal + total/meta + finalizar
   • Catalogo: produtos para adicionar (busca + por categoria)
   • Historico: compras anteriores
   O heroi (total) fica fixo no topo nas abas de compra/catalogo.

   MVP visual: estado local inicializado com dados mock. Vai
   migrar para Context na proxima feature.
   ============================================================ */

const TABS = [
  { key: "compra", label: "Minha compra" },
  { key: "catalogo", label: "Catálogo" },
  { key: "historico", label: "Histórico" },
];

// Junta uma entrada de compra (id + quantidade) com os dados do produto
function montarItem(entrada, catalogo) {
  const produto = catalogo.find((p) => p.id === entrada.id);
  if (!produto) return null;
  return { ...produto, quantity: entrada.quantity };
}

export default function Listagem() {
  const navigate = useNavigate();

  // Estado local — temporario, vira Context na proxima feature
  const [tab, setTab] = useState("compra");
  const [busca, setBusca] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [finalizada, setFinalizada] = useState(null);

  const [compraEntries, setCompraEntries] = useState(COMPRA_INICIAL);
  const [budget] = useState(META_INICIAL);
  const [historico, setHistorico] = useState(HISTORICO);

  // Itens da compra atual com nome/preco/unidade resolvidos
  const list = useMemo(
    () => compraEntries.map((e) => montarItem(e, PRODUTOS)).filter(Boolean),
    [compraEntries],
  );

  const total = list.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = list.reduce((s, i) => s + i.quantity, 0);
  const over = budget != null && total > budget;

  const addedIds = new Set(list.map((i) => i.id));

  const filtrados = PRODUTOS.filter((p) =>
    p.name.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  // Handlers locais (vao para o reducer do Context na proxima feature)
  function onAdd(produtoId) {
    setCompraEntries((prev) => {
      const ja = prev.find((e) => e.id === produtoId);
      if (ja) return prev.map((e) => (e.id === produtoId ? { ...e, quantity: e.quantity + 1 } : e));
      return [...prev, { id: produtoId, quantity: 1 }];
    });
  }
  function onIncrement(id) {
    setCompraEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, quantity: e.quantity + 1 } : e)),
    );
  }
  function onDecrement(id) {
    setCompraEntries((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, quantity: e.quantity - 1 } : e))
        .filter((e) => e.quantity > 0),
    );
  }
  function onRemove(id) {
    setCompraEntries((prev) => prev.filter((e) => e.id !== id));
  }

  function confirmarFinalizar() {
    setConfirmar(false);
    const registro = {
      id: `h-${Date.now()}`,
      data: new Date().toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      total,
      itens: itemCount,
      meta: budget,
    };
    setHistorico((prev) => [registro, ...prev]);
    setFinalizada({ total, itens: itemCount });
    setCompraEntries([]);
    setTab("historico");
  }

  return (
    <div className="csm-screen csm-listagem">
      <Header
        title="Compra"
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cadastro")}
            iconLeft={<Icon name="mais" size={18} />}
          >
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

        {/* heroi fixo (compra/catalogo) */}
        {tab !== "historico" && (
          <div className="csm-listagem__hero">
            <BudgetProgress total={total} budget={budget} itemCount={itemCount} />
          </div>
        )}

        {/* ---- ABA: MINHA COMPRA ---- */}
        {tab === "compra" && (
          <div className="csm-content">
            {finalizada && (
              <AlertMessage
                variant="success"
                title="Compra finalizada!"
                onClose={() => setFinalizada(null)}
              >
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
                  <Button
                    variant="primary"
                    onClick={() => setTab("catalogo")}
                    iconLeft={<Icon name="mais" size={20} />}
                  >
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
                          onIncrement={() => onIncrement(item.id)}
                          onDecrement={() => onDecrement(item.id)}
                          onRemove={() => onRemove(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </Card>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  iconLeft={<Icon name="check-circulo" size={20} />}
                  onClick={() => setConfirmar(true)}
                >
                  Finalizar compra
                </Button>
              </>
            )}
          </div>
        )}

        {/* ---- ABA: CATALOGO ---- */}
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
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/cadastro")}
                    iconLeft={<Icon name="mais" size={20} />}
                  >
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
                              onAdd={() => onAdd(p.id)}
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

        {/* ---- ABA: HISTORICO ---- */}
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

      <BottomNavigation />

      {/* ---- Confirmacao de finalizar ---- */}
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
