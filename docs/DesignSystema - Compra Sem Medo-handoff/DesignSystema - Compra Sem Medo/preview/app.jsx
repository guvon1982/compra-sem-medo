/* ============================================================
   app.jsx (preview) — monta a página de apresentação:
   intro · protótipo interativo · 3 telas lado a lado · vitrine.
   ============================================================ */

const { useState } = React;

function TopBar({ view, setView }) {
  return (
    <header className="ds-topbar">
      <div className="ds-topbar__brand">
        <Logo size={26} />
        <span className="ds-topbar__tag">Design System</span>
      </div>
      <div className="ds-seg" role="tablist" aria-label="Visualização">
        {[["prototipo", "Protótipo"], ["vitrine", "Vitrine"]].map(([k, label]) => (
          <button key={k} role="tab" aria-selected={view === k}
            className={`ds-seg__btn ${view === k ? "is-active" : ""}`}
            onClick={() => setView(k)}>{label}</button>
        ))}
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="ds-intro">
      <p className="ds-intro__eyebrow">Compra Sem Medo · mobile-first (375px)</p>
      <h1 className="ds-intro__title">Sua compra sob controle, sem susto no caixa.</h1>
      <p className="ds-intro__body">
        Design system enxuto e o protótipo clicável das 3 telas. O <strong>total da compra</strong> é
        o herói visual — número grande, atualizado em tempo real. A meta fica <strong>verde</strong> dentro
        do limite e <strong>laranja</strong> ao exceder (sem vermelho). Toque para navegar, adicionar itens,
        cadastrar produtos e finalizar a compra.
      </p>
    </section>
  );
}

function Prototipo() {
  return (
    <div className="ds-view">
      <Intro />

      <section className="ds-block">
        <div className="ds-block__head">
          <h2 className="ds-block__title">Protótipo interativo</h2>
          <p className="ds-block__desc">Comece pela Home, monte a compra e finalize — tudo ao vivo.</p>
        </div>
        <div className="ds-stage ds-stage--hero">
          <Phone label="Toque e explore">
            <PhoneApp startRoute="home" initial={{ list: COMPRA_INICIAL, budget: META_INICIAL }} />
          </Phone>
        </div>
      </section>

      <section className="ds-block">
        <div className="ds-block__head">
          <h2 className="ds-block__title">As 3 telas</h2>
          <p className="ds-block__desc">Home, Cadastro e Listagem lado a lado — cada uma é interativa.</p>
        </div>
        <div className="ds-stage ds-stage--row">
          <Phone label="Home /">
            <PhoneApp startRoute="home" initial={{ list: COMPRA_INICIAL, budget: META_INICIAL }} />
          </Phone>
          <Phone label="Cadastro /cadastro">
            <PhoneApp startRoute="cadastro" initial={{ list: [], budget: null }} />
          </Phone>
          <Phone label="Listagem /listagem">
            <PhoneApp startRoute="listagem" initial={{ list: COMPRA_INICIAL, budget: META_INICIAL }} />
          </Phone>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [view, setView] = useState(() => localStorage.getItem("csm-view") || "prototipo");
  const change = (v) => { setView(v); localStorage.setItem("csm-view", v); };
  return (
    <div className="ds-app">
      <TopBar view={view} setView={change} />
      <main className="ds-main">
        {view === "prototipo" ? <Prototipo /> : <div className="ds-view"><Showcase /></div>}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
