import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
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
import { CATEGORIAS, ICONE_CATEGORIA } from "../../data/mock";
import { formatBRL, parsePreco } from "../../utils/currency";
import { useCatalogo } from "../../contexts/CatalogoContext";
import { useCompra } from "../../contexts/CompraContext";

/* ============================================================
   Listagem (/listagem) — tela combinada em 3 abas:
   • Minha compra: itens com subtotal + total/meta + finalizar
   • Catalogo: produtos para adicionar (busca + por categoria)
   • Historico: compras anteriores
   O heroi (total) fica fixo no topo nas abas de compra/catalogo.

   Catalogo e compra vem agora do Context (CatalogoContext e
   CompraContext). Estado local aqui guarda apenas UI: qual aba
   esta ativa, o texto da busca, e os flags de modal/alerta.
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
  return { ...produto, quantidade: entrada.quantidade };
}

// Histórico antigo guardava `itens` como número (contagem). Versão atual
// guarda array de snapshots. Estes helpers lidam com os dois formatos.
function temDetalhes(h) {
  return Array.isArray(h.itens);
}
function contarItens(h) {
  if (Array.isArray(h.itens)) {
    return h.itens.reduce((s, i) => s + i.quantidade, 0);
  }
  if (typeof h.itens === "number") return h.itens;
  return 0;
}

// Foca um elemento E garante que o anel azul aparece. Browsers (Chrome/Edge)
// escondem :focus-visible quando .focus() é chamado de dentro de um handler
// de clique de mouse — anel ficaria invisível. Marcamos data-focus-injetado
// para forçar o estilo (regra em base.css) e limpamos no blur.
function focarVisivel(el) {
  if (!el) return;
  el.focus();
  el.setAttribute("data-focus-injetado", "true");
  el.addEventListener(
    "blur",
    () => el.removeAttribute("data-focus-injetado"),
    { once: true },
  );
}

// chaves validas de aba — usado para sanitizar o que vem na navegacao
const TAB_KEYS = TABS.map((t) => t.key);

export default function Listagem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { produtos, carregando, erro } = useCatalogo();
  const {
    compraAtual,
    meta,
    historicoCompras,
    adicionarItem,
    incrementar,
    decrementar,
    removerItem,
    definirMeta,
    finalizarCompra,
  } = useCompra();

  // Estado local — apenas UI (qual aba, texto da busca, flags de modal/alerta).
  // Aba inicial pode vir como "recado" da pagina anterior via state da navegacao
  // (ex.: Cadastro envia { aba: "catalogo" } depois de salvar um produto).
  // Lazy initializer (funcao dentro do useState) roda so no primeiro mount.
  const [tab, setTab] = useState(() => {
    const abaSugerida = location.state?.aba;
    return TAB_KEYS.includes(abaSugerida) ? abaSugerida : "compra";
  });
  const [busca, setBusca] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [finalizada, setFinalizada] = useState(null);
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [valorMeta, setValorMeta] = useState("");
  const [erroMeta, setErroMeta] = useState(null);
  // Detalhe de uma compra do histórico (F11): null = lista; objeto = detalhe.
  const [compraSelecionada, setCompraSelecionada] = useState(null);
  // ID do card que abriu o detalhe — usado para devolver o foco ao voltar (a11y).
  const [idVoltar, setIdVoltar] = useState(null);

  // Itens da compra atual com nome/preco/unidade resolvidos do catalogo.
  const list = useMemo(
    () => compraAtual.map((e) => montarItem(e, produtos)).filter(Boolean),
    [compraAtual, produtos],
  );

  const total = list.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const itemCount = list.reduce((s, i) => s + i.quantidade, 0);
  const budget = meta;
  const over = budget != null && total > budget;

  const addedIds = new Set(list.map((i) => i.id));

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.trim().toLowerCase()),
  );

  // Acessibilidade do modal: ao abrir, foco vai para o botao primario;
  // ao fechar (depois de ter sido aberto), foco volta para o botao
  // que abriu o modal. `confirmarJaAbriu` evita focar na primeira render.
  const finalizarRef = useRef(null);
  const confirmarBotaoRef = useRef(null);
  const confirmarJaAbriu = useRef(false);

  useEffect(() => {
    if (confirmar) {
      confirmarJaAbriu.current = true;
      focarVisivel(confirmarBotaoRef.current);
    } else if (confirmarJaAbriu.current) {
      focarVisivel(finalizarRef.current);
    }
  }, [confirmar]);

  // Acessibilidade do detalhe do histórico: ao abrir, foco no botão "Voltar";
  // ao voltar, foco no card de origem (rastreado por id).
  const voltarRef = useRef(null);
  const cardsHistRef = useRef({});

  useEffect(() => {
    if (compraSelecionada) {
      focarVisivel(voltarRef.current);
    } else if (idVoltar) {
      focarVisivel(cardsHistRef.current[idVoltar]);
    }
  }, [compraSelecionada, idVoltar]);

  function handleAbrirMeta() {
    setValorMeta(meta != null ? String(meta).replace(".", ",") : "");
    setErroMeta(null);
    setEditandoMeta(true);
  }

  function handleSalvarMeta(e) {
    e.preventDefault();
    const valor = parsePreco(valorMeta);
    if (Number.isNaN(valor) || valor <= 0) {
      setErroMeta("Informe um valor positivo. Ex: 300,00");
      return;
    }
    definirMeta(valor);
    setEditandoMeta(false);
  }

  function handleRemoverMeta() {
    definirMeta(null);
    setEditandoMeta(false);
  }

  function confirmarFinalizar() {
    setConfirmar(false);
    // Guardamos o resumo aqui para mostrar no alerta de sucesso ANTES de
    // disparar finalizarCompra (que zera compraAtual e portanto zera total).
    setFinalizada({ total, itens: itemCount });
    // Snapshot dos itens — congela nome/preço/categoria/unidade no momento da
    // compra. Necessário para o histórico continuar fiel mesmo se um produto
    // for editado/excluído depois (RN10 do PRD).
    const itensDetalhados = list.map(
      ({ id, nome, categoria, unidade, preco, quantidade }) => ({
        id,
        nome,
        categoria,
        unidade,
        preco,
        quantidade,
      }),
    );
    finalizarCompra({ total, itensDetalhados });
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
            <BudgetProgress
              total={total}
              budget={budget}
              itemCount={itemCount}
              onSetBudget={handleAbrirMeta}
            />
            {editandoMeta && (
              <form className="csm-meta-form" onSubmit={handleSalvarMeta}>
                <Input
                  label="Meta de gasto (R$)"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 300,00"
                  value={valorMeta}
                  onChange={(e) => { setValorMeta(e.target.value); setErroMeta(null); }}
                  error={erroMeta}
                  autoFocus
                />
                <div className="csm-meta-form__actions">
                  <Button variant="primary" size="sm" type="submit">
                    Confirmar
                  </Button>
                  {meta != null && (
                    <Button variant="ghost" size="sm" type="button" onClick={handleRemoverMeta}>
                      Sem meta
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" type="button" onClick={() => setEditandoMeta(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
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
                          nome={item.nome}
                          precoUnitario={item.preco}
                          quantidade={item.quantidade}
                          unidade={item.unidade}
                          onIncrement={() => incrementar(item.id)}
                          onDecrement={() => decrementar(item.id)}
                          onRemove={() => removerItem(item.id)}
                        />
                      </li>
                    ))}
                  </ul>
                </Card>

                <Button
                  ref={finalizarRef}
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
            {erro && (
              <AlertMessage variant="error" title="Não foi possível carregar o catálogo">
                {erro}
              </AlertMessage>
            )}

            <Input
              label="Buscar produto"
              placeholder="Buscar no catálogo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              prefix={<Icon name="busca" size={18} />}
            />

            {carregando ? (
              <EmptyState
                icon="carrinho"
                title="Carregando catálogo..."
                description="Buscando os produtos no servidor."
              />
            ) : filtrados.length === 0 ? (
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
                const doGrupo = filtrados.filter((p) => p.categoria === cat);
                if (doGrupo.length === 0) return null;
                return (
                  <section key={cat} aria-label={cat}>
                    <p className="csm-section-label csm-listagem__cat">{cat}</p>
                    <Card padding="none">
                      <ul className="csm-divided">
                        {doGrupo.map((p) => (
                          <li key={p.id}>
                            <ProductItem
                              nome={p.nome}
                              categoria={p.categoria}
                              unidade={p.unidade}
                              preco={p.preco}
                              added={addedIds.has(p.id)}
                              icon={<Icon name={ICONE_CATEGORIA[p.categoria] || "caixa"} size={20} />}
                              onAdd={() => adicionarItem(p.id)}
                              onEdit={() => navigate(`/cadastro/${p.id}`)}
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
        {tab === "historico" && !compraSelecionada && (
          <div className="csm-content">
            {historicoCompras.length === 0 ? (
              <EmptyState
                icon="historico"
                title="Nenhuma compra anterior"
                description="Quando você finalizar uma compra, ela aparece aqui."
              />
            ) : (
              <ul className="csm-listagem__hist">
                {historicoCompras.map((h) => {
                  const passou = h.meta != null && h.total > h.meta;
                  const qtd = contarItens(h);
                  return (
                    <li key={h.id}>
                      <Card
                        as="button"
                        interactive
                        padding="md"
                        type="button"
                        className="csm-hist csm-hist--btn"
                        ref={(el) => {
                          if (el) cardsHistRef.current[h.id] = el;
                        }}
                        onClick={() => {
                          setIdVoltar(h.id);
                          setCompraSelecionada(h);
                        }}
                        aria-label={`Ver detalhes da compra de ${h.data}, total ${formatBRL(h.total)}`}
                      >
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
                            {qtd} {qtd === 1 ? "item" : "itens"}
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

        {/* ---- ABA: HISTORICO — DETALHE DA COMPRA ---- */}
        {tab === "historico" && compraSelecionada && (
          <div className="csm-content">
            <Button
              ref={voltarRef}
              variant="ghost"
              size="sm"
              onClick={() => setCompraSelecionada(null)}
              iconLeft={<Icon name="voltar" size={18} />}
            >
              Voltar ao histórico
            </Button>

            <Card padding="md" className="csm-hist-detalhe__resumo">
              <div className="csm-hist__top">
                <span className="csm-hist__date">{compraSelecionada.data}</span>
                {compraSelecionada.meta != null && (
                  <span
                    className={`csm-hist__chip ${
                      compraSelecionada.total > compraSelecionada.meta
                        ? "is-over"
                        : "is-ok"
                    }`}
                  >
                    {compraSelecionada.total > compraSelecionada.meta
                      ? "Passou da meta"
                      : "Dentro da meta"}
                  </span>
                )}
              </div>
              <div className="csm-hist__bottom">
                <span className="csm-hist__total">{formatBRL(compraSelecionada.total)}</span>
                <span className="csm-hist__items">
                  {contarItens(compraSelecionada)}{" "}
                  {contarItens(compraSelecionada) === 1 ? "item" : "itens"}
                </span>
              </div>
              {compraSelecionada.meta != null && (
                <p className="csm-hist-detalhe__meta">
                  Meta original: <strong>{formatBRL(compraSelecionada.meta)}</strong>
                </p>
              )}
            </Card>

            {temDetalhes(compraSelecionada) ? (
              <Card padding="none">
                <ul className="csm-divided">
                  {compraSelecionada.itens.map((item, idx) => (
                    <li key={`${item.id}-${idx}`}>
                      <ShoppingListItem
                        nome={item.nome}
                        precoUnitario={item.preco}
                        quantidade={item.quantidade}
                        unidade={item.unidade}
                        readOnly
                      />
                    </li>
                  ))}
                </ul>
              </Card>
            ) : (
              <AlertMessage variant="alert" title="Detalhes não disponíveis">
                Esta compra foi finalizada antes da atualização que passou a
                guardar os itens. Compras feitas a partir de agora aparecem
                aqui com a lista completa.
              </AlertMessage>
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
              <Button ref={confirmarBotaoRef} variant="primary" size="lg" fullWidth onClick={confirmarFinalizar}>
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
