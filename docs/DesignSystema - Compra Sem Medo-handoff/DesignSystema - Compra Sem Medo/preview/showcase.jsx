/* ============================================================
   showcase.jsx (preview) — vitrine do design system:
   tokens (cores, tipografia, espaçamento, raios) + os 10
   componentes com suas variantes.
   ============================================================ */

function SpecCard({ title, desc, children, wide }) {
  return (
    <div className={`spec ${wide ? "spec--wide" : ""}`}>
      <div className="spec__head">
        <h3 className="spec__title">{title}</h3>
        {desc && <p className="spec__desc">{desc}</p>}
      </div>
      <div className="spec__body">{children}</div>
    </div>
  );
}

const GRUPOS_COR = [
  {
    g: "Marca & estados",
    items: [
      ["Verde primário", "#22C55E", "--color-green-primary", true],
      ["Verde escuro", "#15803D", "--color-green-dark", true],
      ["Azul ação", "#2563EB", "--color-blue-primary", true],
      ["Azul leve", "#0EA5E9", "--color-blue-light", true],
      ["Laranja alerta", "#F97316", "--color-orange-alert", true],
      ["Roxo apoio", "#8B5CF6", "--color-purple-support", true],
    ],
  },
  {
    g: "Superfícies & texto",
    items: [
      ["Fundo", "#F8FAFC", "--color-background", false],
      ["Superfície", "#FFFFFF", "--color-surface", false],
      ["Borda", "#E2E8F0", "--color-border", false],
      ["Texto primário", "#0F172A", "--color-text-primary", true],
      ["Texto secundário", "#64748B", "--color-text-secondary", true],
    ],
  },
];

function Cores() {
  return (
    <div className="swatches">
      {GRUPOS_COR.map((grp) => (
        <div key={grp.g} className="swatch-group">
          <p className="swatch-group__label">{grp.g}</p>
          <div className="swatch-row">
            {grp.items.map(([nome, hex, varname, dark]) => (
              <div key={varname} className="swatch">
                <span className="swatch__chip" style={{ background: hex, color: dark ? "#fff" : "#0F172A" }}>Aa</span>
                <span className="swatch__name">{nome}</span>
                <span className="swatch__hex">{hex}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const ESCALA_TIPO = [
  ["Total (herói)", "var(--text-display)", 700, "R$ 248,90"],
  ["Título de tela", "var(--text-h1)", 700, "Minha compra"],
  ["Seção", "var(--text-h2)", 600, "Catálogo de produtos"],
  ["Card / item", "var(--text-h3)", 600, "Arroz Tio João 5kg"],
  ["Corpo", "var(--text-body)", 400, "Acompanhe o total em tempo real."],
  ["Secundário", "var(--text-sm)", 400, "Alimentos · 5kg"],
  ["Rótulo / caption", "var(--text-xs)", 500, "DENTRO DA META"],
];

function Tipografia() {
  return (
    <div className="type-scale">
      <p className="type-scale__note">Família única: <strong>Inter</strong>. Hierarquia por tamanho e peso — nunca por cor.</p>
      {ESCALA_TIPO.map(([nome, size, weight, sample]) => (
        <div key={nome} className="type-row">
          <span className="type-row__meta">{nome}</span>
          <span className="type-row__sample" style={{ fontSize: size, fontWeight: weight }}>{sample}</span>
        </div>
      ))}
    </div>
  );
}

const ESPACOS = [["1", 4], ["2", 8], ["3", 12], ["4", 16], ["6", 24], ["8", 32], ["12", 48], ["16", 64]];
const RAIOS = [["sm", "4px"], ["md", "8px"], ["lg", "12px"], ["pill", "9999px"]];

function EspacoRaio() {
  return (
    <div className="tokens-grid">
      <div>
        <p className="swatch-group__label">Espaçamento (escala 4px)</p>
        <div className="space-scale">
          {ESPACOS.map(([n, px]) => (
            <div key={n} className="space-row">
              <span className="space-row__bar" style={{ width: px }} />
              <span className="space-row__label">{px}px <em>·{n}</em></span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="swatch-group__label">Raios de borda</p>
        <div className="radius-row">
          {RAIOS.map(([n, v]) => (
            <div key={n} className="radius-item">
              <span className="radius-item__box" style={{ borderRadius: v === "9999px" ? "999px" : v }} />
              <span className="radius-item__label">{n}<br />{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* demo com estado para o stepper do ShoppingListItem */
function ListItemDemo() {
  const [qty, setQty] = React.useState(2);
  return (
    <Card padding="none" style={{ width: "100%" }}>
      <ShoppingListItem
        name="Leite Itambé 1L"
        unitPrice={5.29}
        quantity={qty}
        unit="1L"
        onIncrement={() => setQty((q) => q + 1)}
        onDecrement={() => setQty((q) => Math.max(1, q - 1))}
        onRemove={() => setQty(1)}
      />
    </Card>
  );
}

function ProductDemo() {
  const [added, setAdded] = React.useState(false);
  return (
    <Card padding="none" style={{ width: "100%" }}>
      <ul className="csm-divided">
        <li>
          <ProductItem name="Café Pilão 500g" category="Bebidas" unit="500g" price={14.9}
            added={added} icon={<Icon name="info" size={20} />} onAdd={() => setAdded(true)} />
        </li>
        <li>
          <ProductItem name="Detergente Ypê 500ml" category="Limpeza" unit="500ml" price={2.79}
            added icon={<Icon name="tag" size={20} />} onAdd={() => {}} />
        </li>
      </ul>
    </Card>
  );
}

function Componentes() {
  return (
    <div className="spec-grid">
      <SpecCard title="Logo" desc="Carrinho com cadeado integrado + wordmark.">
        <div className="demo-col">
          <Logo size={30} />
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Logo variant="mark" size={40} />
            <span style={{ fontSize: 12, color: "#64748B" }}>variant=&quot;mark&quot;</span>
          </div>
        </div>
      </SpecCard>

      <SpecCard title="Button" desc="variant · size · ícones · loading">
        <div className="demo-wrap">
          <Button variant="primary">Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="danger">Destrutivo</Button>
        </div>
        <div className="demo-wrap">
          <Button size="sm">Pequeno</Button>
          <Button size="md">Médio</Button>
          <Button size="lg">Grande</Button>
        </div>
        <div className="demo-wrap">
          <Button iconLeft={<Icon name="mais" size={20} />}>Adicionar</Button>
          <Button variant="secondary" loading>Salvando</Button>
          <Button disabled>Desabilitado</Button>
        </div>
      </SpecCard>

      <SpecCard title="Input" desc="texto · select · prefixo · validação inline">
        <div className="demo-col">
          <Input label="Nome do produto" placeholder="Ex.: Arroz Tio João 5kg" defaultValue="" />
          <Input as="select" label="Categoria" placeholder="Selecione" options={CATEGORIAS} defaultValue="" />
          <Input label="Preço" prefix="R$" placeholder="0,00" hint="Usado no cálculo do total." />
          <Input label="Nome do produto" error="Dê um nome com pelo menos 2 letras." defaultValue="A" />
        </div>
      </SpecCard>

      <SpecCard title="AlertMessage" desc="success · info · alert · error">
        <div className="demo-col">
          <AlertMessage variant="success" title="Pronto! Produto adicionado à compra." />
          <AlertMessage variant="info" title="Dica">Defina uma meta para acompanhar o gasto.</AlertMessage>
          <AlertMessage variant="alert" title="Atenção: você passou R$ 12,30 da meta." />
          <AlertMessage variant="error" title="Não foi possível salvar">Verifique os campos destacados.</AlertMessage>
        </div>
      </SpecCard>

      <SpecCard title="BudgetProgress" desc="Herói visual: dentro / excedido / sem meta">
        <div className="demo-col demo-col--mobile">
          <Card padding="none"><BudgetProgress total={42.8} budget={60} itemCount={4} /></Card>
          <Card padding="none"><BudgetProgress total={72.3} budget={60} itemCount={7} /></Card>
          <Card padding="none"><BudgetProgress total={18.5} budget={null} itemCount={2} onSetBudget={() => {}} /></Card>
        </div>
      </SpecCard>

      <SpecCard title="ProductItem" desc="Catálogo: adicionar / já adicionado">
        <div className="demo-col demo-col--mobile"><ProductDemo /></div>
      </SpecCard>

      <SpecCard title="ShoppingListItem" desc="Stepper + subtotal em tempo real">
        <div className="demo-col demo-col--mobile"><ListItemDemo /></div>
      </SpecCard>

      <SpecCard title="Card" desc="default · muted · interativo">
        <div className="demo-col">
          <Card padding="md">Card padrão com borda fina.</Card>
          <Card padding="md" variant="muted">Card muted (fundo do app).</Card>
          <Card padding="md" interactive>Card interativo (hover/active).</Card>
        </div>
      </SpecCard>

      <SpecCard title="EmptyState" desc="Vazio amigável">
        <div className="demo-col demo-col--mobile">
          <Card padding="none">
            <EmptyState icon="carrinho" title="Sua lista está vazia"
              description="Que tal começar adicionando um produto?"
              action={<Button variant="primary" iconLeft={<Icon name="mais" size={20} />}>Ver catálogo</Button>} />
          </Card>
        </div>
      </SpecCard>

      <SpecCard title="Header · BottomNavigation" desc="Barras de topo e rodapé">
        <div className="demo-col demo-col--mobile">
          <div className="bar-demo"><Header /></div>
          <div className="bar-demo"><Header title="Novo produto" onBack={() => {}} /></div>
          <div className="bar-demo"><BottomNavigation active="listagem" onNavigate={() => {}} /></div>
        </div>
      </SpecCard>
    </div>
  );
}

function Showcase() {
  return (
    <div className="vitrine">
      <section className="vitrine__section">
        <h2 className="vitrine__h2">Cores</h2>
        <Cores />
      </section>
      <section className="vitrine__section">
        <h2 className="vitrine__h2">Tipografia</h2>
        <Tipografia />
      </section>
      <section className="vitrine__section">
        <h2 className="vitrine__h2">Espaçamento & raios</h2>
        <EspacoRaio />
      </section>
      <section className="vitrine__section">
        <h2 className="vitrine__h2">Componentes</h2>
        <Componentes />
      </section>
    </div>
  );
}

Object.assign(window, { Showcase });
