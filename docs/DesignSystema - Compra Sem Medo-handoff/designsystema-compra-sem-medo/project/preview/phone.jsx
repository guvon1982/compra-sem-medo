/* ============================================================
   phone.jsx (preview) — moldura de celular + estado interativo
   da compra. NÃO faz parte do design system entregue; serve só
   para demonstrar as telas ao vivo a 375px.
   ============================================================ */

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
function hojeBR() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

/* hook de estado da compra (cada celular tem o seu) */
function useCarrinho(inicial = {}) {
  const [products, setProducts] = React.useState(PRODUTOS);
  const [list, setList] = React.useState(inicial.list || []);
  const [budget, setBudget] = React.useState(inicial.budget !== undefined ? inicial.budget : null);
  const [historico, setHistorico] = React.useState(HISTORICO);

  const items = list
    .map((li) => {
      const p = products.find((x) => x.id === li.id);
      return p ? { ...p, quantity: li.quantity } : null;
    })
    .filter(Boolean);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  const addProduct = (id) =>
    setList((l) =>
      l.some((x) => x.id === id)
        ? l.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x))
        : [...l, { id, quantity: 1 }]
    );
  const increment = (id) =>
    setList((l) => l.map((x) => (x.id === id ? { ...x, quantity: x.quantity + 1 } : x)));
  const decrement = (id) =>
    setList((l) =>
      l.flatMap((x) =>
        x.id === id ? (x.quantity <= 1 ? [] : [{ ...x, quantity: x.quantity - 1 }]) : [x]
      )
    );
  const remove = (id) => setList((l) => l.filter((x) => x.id !== id));
  const finalize = () => {
    setHistorico((h) => [
      { id: `h-${Date.now()}`, data: hojeBR(), total, itens: itemCount, meta: budget },
      ...h,
    ]);
    setList([]);
  };
  const createProduct = (p) => setProducts((ps) => [p, ...ps]);
  const setMeta = () => setBudget(100);

  return {
    products, list: items, budget, total, itemCount, historico,
    addProduct, increment, decrement, remove, finalize, createProduct, setMeta,
  };
}

/* renderiza a rota atual dentro do estado de um celular */
function PhoneApp({ startRoute = "home", initial = {} }) {
  const [route, setRoute] = React.useState(startRoute);
  const c = useCarrinho(initial);
  const navigate = (key) => setRoute(key);

  if (route === "cadastro") {
    return <Cadastro onNavigate={navigate} onCreate={c.createProduct} />;
  }
  if (route === "listagem") {
    return (
      <Listagem
        products={c.products}
        list={c.list}
        budget={c.budget}
        total={c.total}
        itemCount={c.itemCount}
        historico={c.historico}
        onAdd={c.addProduct}
        onIncrement={c.increment}
        onDecrement={c.decrement}
        onRemove={c.remove}
        onFinalize={c.finalize}
        onSetBudget={c.setMeta}
        onNavigate={navigate}
      />
    );
  }
  return (
    <Home
      hasPurchase={c.list.length > 0}
      total={c.total}
      budget={c.budget}
      itemCount={c.itemCount}
      onNavigate={navigate}
    />
  );
}

/* moldura de aparelho (tela útil = 375px) */
function Phone({ children, label }) {
  return (
    <figure className="phone-wrap">
      {label && <figcaption className="phone-label">{label}</figcaption>}
      <div className="phone">
        <div className="phone__screen">{children}</div>
      </div>
    </figure>
  );
}

Object.assign(window, { PhoneApp, Phone, useCarrinho });
