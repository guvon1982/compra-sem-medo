/* AUTO-GERADO a partir de src/ — NÃO editar à mão. */


/* ===== src/utils/currency.js ===== */
/* ============================================================
   currency.js — formatação de moeda em Real (pt-BR).
   Sempre vírgula decimal e duas casas: 24.9 -> "R$ 24,90".
   ============================================================ */

function formatBRL(value) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* número simples com vírgula decimal, sem símbolo (ex.: "1,5 kg") */
function formatNum(value, digits = 0) {
  const n = Number.isFinite(value) ? value : 0;
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/* ===== src/data/mock.js ===== */
/* ============================================================
   mock.js — dados fake (apenas para o protótipo visual).
   Produtos brasileiros reais, categorias e histórico.
   Nenhuma lógica de negócio aqui — só dados.
   ============================================================ */

const CATEGORIAS = ["Alimentos", "Bebidas", "Higiene", "Limpeza"];

const UNIDADES = [
  "Unidade", "Pacote", "Caixa", "Garrafa", "Lata",
  "100g", "500g", "1kg", "5kg", "500ml", "900ml", "1L", "2L",
];

/* ícone de categoria (nome do componente Icon) */
const ICONE_CATEGORIA = {
  Alimentos: "caixa",
  Bebidas: "info",
  Higiene: "tag",
  Limpeza: "tag",
};

const PRODUTOS = [
  { id: "p1", name: "Arroz Tio João 5kg", category: "Alimentos", unit: "5kg", price: 29.9 },
  { id: "p2", name: "Feijão Camil 1kg", category: "Alimentos", unit: "1kg", price: 8.49 },
  { id: "p3", name: "Café Pilão 500g", category: "Bebidas", unit: "500g", price: 14.9 },
  { id: "p4", name: "Leite Itambé 1L", category: "Bebidas", unit: "1L", price: 5.29 },
  { id: "p5", name: "Açúcar União 1kg", category: "Alimentos", unit: "1kg", price: 4.99 },
  { id: "p6", name: "Macarrão Barilla 500g", category: "Alimentos", unit: "500g", price: 6.79 },
  { id: "p7", name: "Óleo Soya 900ml", category: "Alimentos", unit: "900ml", price: 7.49 },
  { id: "p8", name: "Sabão em pó OMO 1,6kg", category: "Limpeza", unit: "1,6kg", price: 22.9 },
  { id: "p9", name: "Detergente Ypê 500ml", category: "Limpeza", unit: "500ml", price: 2.79 },
  { id: "p10", name: "Papel higiênico Neve 12 rolos", category: "Higiene", unit: "12 rolos", price: 18.9 },
];

/* compra atual inicial (já com alguns itens p/ demonstrar o herói) */
const COMPRA_INICIAL = [
  { id: "p1", quantity: 1 },
  { id: "p4", quantity: 2 },
  { id: "p6", quantity: 1 },
];

const META_INICIAL = 60;

/* histórico de compras anteriores */
const HISTORICO = [
  { id: "h1", data: "28 mai 2026", total: 142.3, itens: 12, meta: 150 },
  { id: "h2", data: "21 mai 2026", total: 187.5, itens: 15, meta: 160 },
  { id: "h3", data: "14 mai 2026", total: 96.8, itens: 8, meta: null },
];

/* ===== src/components/Icon/index.jsx ===== */
/* ============================================================
   Icon — ícones de linha minimalistas (estilo Feather/Lucide).
   Stroke 2, viewBox 24, currentColor. Tamanho via prop `size`.
   Uso: <Icon name="carrinho" size={24} />
   ============================================================ */

const PATHS = {
  // navegação
  casa: <path d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5" />,
  carrinho: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2.2l2.3 12.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3l1.4-7.2H6" />
    </>
  ),
  lista: (
    <>
      <path d="M8 6h11M8 12h11M8 18h11" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" />
    </>
  ),
  // ações
  mais: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  busca: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </>
  ),
  lixeira: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  voltar: <path d="m15 5-7 7 7 7" />,
  avancar: <path d="m9 5 7 7-7 7" />,
  fechar: <path d="M6 6l12 12M18 6 6 18" />,
  // estados / feedback
  check: <path d="m4 12 5 5L20 6" />,
  "check-circulo": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  // domínio
  cadeado: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  meta: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  tag: (
    <>
      <path d="M3 11.5V4h7.5L21 14.5 13.5 22 3 11.5Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  caixa: (
    <>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z" />
      <path d="M3 7.5 12 12l9-4.5M12 12v9" />
    </>
  ),
  historico: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3 8" />
      <path d="M3 4v4h4" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  cartao: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 9.5h18M7 14.5h4" />
    </>
  ),
};

function Icon({ name, size = 24, className = "", strokeWidth = 2, ...rest }) {
  const path = PATHS[name];
  if (!path) return null;
  return (
    <svg
      className={`csm-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {path}
    </svg>
  );
}

/* ===== src/components/Logo/index.jsx ===== */
/* ============================================================
   Logo — "Compra Sem Medo".
   Marca aprovada: carrinho de supermercado de linha com um
   cadeado integrado ao basket (proteção/segurança), verde
   primário. Stroke arredondado, minimalista.
   Uso: <Logo />  ou  <Logo variant="mark" />
   ============================================================ */

function Mark({ size = 32 }) {
  return (
    <svg
      className="csm-logo__mark"
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* carrinho: alça + corpo do basket */}
      <path d="M4 7h3.4l1.1 2.4" />
      <path d="M9.6 11.8 7.4 9.4h27.2l-2.1 11.4a2.2 2.2 0 0 1-2.2 1.8H13.5a2.2 2.2 0 0 1-2.2-1.8L9.6 11.8Z" />
      {/* rodas */}
      <circle cx="15.5" cy="34" r="2.3" />
      <circle cx="30" cy="34" r="2.3" />
      {/* pernas até as rodas */}
      <path d="M13 22.6 14.4 31M32 22.6 30.6 31" />
      {/* cadeado integrado dentro do basket */}
      <path d="M18.8 13.4v-2a3.2 3.2 0 0 1 6.4 0v2" strokeWidth="2" />
      <rect x="16.4" y="13.4" width="11.2" height="6.2" rx="1.6" />
      <path d="M22 16v1.6" strokeWidth="2" />
    </svg>
  );
}

function Logo({ variant = "full", size = 30, className = "" }) {
  if (variant === "mark") {
    return (
      <span className={`csm-logo csm-logo--mark ${className}`} aria-label="Compra Sem Medo">
        <Mark size={size} />
      </span>
    );
  }
  return (
    <span className={`csm-logo ${className}`} role="img" aria-label="Compra Sem Medo">
      <Mark size={size} />
      <span className="csm-logo__word">
        Compra <strong>Sem Medo</strong>
      </span>
    </span>
  );
}

/* ===== src/components/Button/index.jsx ===== */
/* ============================================================
   Button — uma única fonte de verdade, variantes por prop.
   variant: primary | secondary | ghost | danger
   size:    sm | md | lg
   Props:   fullWidth, loading, disabled, iconLeft, iconRight, type
   Acessível: <button> real, alvo ≥ 44px (md/lg), foco visível.
   ============================================================ */

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = "button",
  ...rest
}) {
  const classes = [
    "csm-btn",
    `csm-btn--${variant}`,
    `csm-btn--${size}`,
    fullWidth ? "csm-btn--block" : "",
    loading ? "is-loading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="csm-btn__spinner" aria-hidden="true" />}
      {!loading && iconLeft && <span className="csm-btn__icon">{iconLeft}</span>}
      <span className="csm-btn__label">{children}</span>
      {!loading && iconRight && <span className="csm-btn__icon">{iconRight}</span>}
    </button>
  );
}

/* ===== src/components/Input/index.jsx ===== */
/* ============================================================
   Input — campo de formulário acessível.
   <label htmlFor> sempre ligado ao controle. Validação inline
   via prop `error`. `hint` para ajuda. Suporta input | select |
   textarea pela prop `as` (categoria/unidade da tela Cadastro
   usam o mesmo componente).
   ============================================================ */

function Input({
  id,
  label,
  value,
  onChange,
  type = "text",
  as = "input",
  options = [],
  placeholder,
  error,
  hint,
  required = false,
  prefix,
  ...rest
}) {
  const autoId = React.useId();
  const fieldId = id || `csm-field-${autoId}`;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  const invalid = Boolean(error);

  const controlProps = {
    id: fieldId,
    value,
    onChange,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
    className: "csm-input__control",
    required,
    ...rest,
  };

  return (
    <div className={`csm-input ${invalid ? "is-invalid" : ""}`}>
      {label && (
        <label className="csm-input__label" htmlFor={fieldId}>
          {label}
          {required && <span className="csm-input__req" aria-hidden="true"> *</span>}
        </label>
      )}

      <div className={`csm-input__field ${prefix ? "has-prefix" : ""}`}>
        {prefix && <span className="csm-input__prefix">{prefix}</span>}

        {as === "select" ? (
          <select {...controlProps}>
            {placeholder && <option value="" disabled hidden>{placeholder}</option>}
            {options.map((opt) => {
              const o = typeof opt === "string" ? { value: opt, label: opt } : opt;
              return (
                <option key={o.value} value={o.value}>{o.label}</option>
              );
            })}
          </select>
        ) : as === "textarea" ? (
          <textarea {...controlProps} placeholder={placeholder} rows={rest.rows || 3} />
        ) : (
          <input {...controlProps} type={type} placeholder={placeholder} />
        )}
      </div>

      {error ? (
        <p className="csm-input__msg csm-input__msg--error" id={errorId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="csm-input__msg csm-input__msg--hint" id={hintId}>{hint}</p>
      ) : null}
    </div>
  );
}

/* ===== src/components/Card/index.jsx ===== */
/* ============================================================
   Card — superfície de conteúdo. Borda fina por padrão
   (preferida a sombra). `as` para semântica (<section>,
   <article>...). `interactive` quando o card inteiro é clicável.
   variant: default | muted
   padding: none | sm | md | lg
   ============================================================ */

function Card({
  children,
  as: Tag = "div",
  variant = "default",
  padding = "md",
  interactive = false,
  className = "",
  ...rest
}) {
  const classes = [
    "csm-card",
    `csm-card--${variant}`,
    `csm-card--pad-${padding}`,
    interactive ? "csm-card--interactive" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}

/* ===== src/components/ProductItem/index.jsx ===== */
/* ============================================================
   ProductItem — produto no catálogo. Mostra nome, categoria/
   unidade e preço; ação de adicionar à compra. Quando já está
   na compra, o botão vira estado "adicionado".
   ============================================================ */

function ProductItem({
  name,
  category,
  unit,
  price,
  icon = null,
  added = false,
  onAdd,
}) {
  return (
    <article className="csm-product">
      {icon && <span className="csm-product__icon" aria-hidden="true">{icon}</span>}

      <div className="csm-product__info">
        <p className="csm-product__name">{name}</p>
        <p className="csm-product__meta">
          {category} · {unit}
        </p>
      </div>

      <div className="csm-product__right">
        <span className="csm-product__price">{formatBRL(price)}</span>
        <button
          type="button"
          className={`csm-product__add ${added ? "is-added" : ""}`}
          onClick={onAdd}
          aria-label={added ? `${name} já está na compra. Adicionar mais um` : `Adicionar ${name} à compra`}
        >
          <Icon name={added ? "check" : "mais"} size={20} />
        </button>
      </div>
    </article>
  );
}

/* ===== src/components/ShoppingListItem/index.jsx ===== */
/* ============================================================
   ShoppingListItem — item da compra atual. Stepper de
   quantidade (− / +), preço unitário e subtotal calculado em
   tempo real (subtotal = preço × quantidade). Remover item.
   Renderiza o conteúdo de um <li> (a lista usa <ul>/<li>).
   ============================================================ */

function ShoppingListItem({
  name,
  unitPrice,
  quantity,
  unit,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  const subtotal = unitPrice * quantity;

  return (
    <article className="csm-listitem">
      <div className="csm-listitem__head">
        <p className="csm-listitem__name">{name}</p>
        <span className="csm-listitem__subtotal">{formatBRL(subtotal)}</span>
      </div>

      <div className="csm-listitem__controls">
        <div className="csm-stepper" role="group" aria-label={`Quantidade de ${name}`}>
          <button
            type="button"
            className="csm-stepper__btn"
            onClick={onDecrement}
            aria-label={`Diminuir quantidade de ${name}`}
          >
            <Icon name="menos" size={18} />
          </button>
          <span className="csm-stepper__value" aria-live="polite">{quantity}</span>
          <button
            type="button"
            className="csm-stepper__btn"
            onClick={onIncrement}
            aria-label={`Aumentar quantidade de ${name}`}
          >
            <Icon name="mais" size={18} />
          </button>
        </div>

        <span className="csm-listitem__unit">
          {formatBRL(unitPrice)} <span className="csm-listitem__unit-label">/ {unit}</span>
        </span>

        <button
          type="button"
          className="csm-listitem__remove"
          onClick={onRemove}
          aria-label={`Remover ${name} da compra`}
        >
          <Icon name="lixeira" size={18} />
        </button>
      </div>
    </article>
  );
}

/* ===== src/components/BudgetProgress/index.jsx ===== */
/* ============================================================
   BudgetProgress — HERÓI VISUAL. Total da compra em número
   grande + barra de meta opcional. Verde dentro da meta,
   laranja quando excede (nunca vermelho). Calcula sozinho
   o quanto falta / quanto passou.
   ============================================================ */

function BudgetProgress({
  total = 0,
  budget = null,
  itemCount = 0,
  onSetBudget,
}) {
  const hasBudget = budget != null && budget > 0;
  const over = hasBudget && total > budget;
  const pct = hasBudget ? Math.min((total / budget) * 100, 100) : 0;
  const diff = hasBudget ? Math.abs(budget - total) : 0;
  const state = over ? "over" : "ok";

  return (
    <section className={`csm-budget csm-budget--${state}`} aria-label="Total da compra">
      <header className="csm-budget__top">
        <p className="csm-budget__label">Total da compra</p>
        <span className="csm-budget__count">
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </span>
      </header>

      <p className="csm-budget__total">{formatBRL(total)}</p>

      {hasBudget ? (
        <div className="csm-budget__meta">
          <div className="csm-budget__bar" role="progressbar"
               aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
            <span className="csm-budget__fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="csm-budget__row">
            <span className="csm-budget__metavalue">Meta {formatBRL(budget)}</span>
            <span className="csm-budget__status">
              {over
                ? `Passou ${formatBRL(diff)}`
                : `Faltam ${formatBRL(diff)}`}
            </span>
          </div>
        </div>
      ) : (
        <button type="button" className="csm-budget__setmeta" onClick={onSetBudget}>
          <Icon name="meta" size={18} />
          Definir meta de gasto
        </button>
      )}
    </section>
  );
}

/* ===== src/components/Header/index.jsx ===== */
/* ============================================================
   Header — barra superior fixa. Na Home mostra o logo; nas
   demais telas mostra voltar + título. Ação opcional à direita.
   ============================================================ */

function Header({ title, onBack, action = null }) {
  return (
    <header className="csm-header">
      <div className="csm-header__left">
        {onBack ? (
          <>
            <button
              type="button"
              className="csm-header__back"
              onClick={onBack}
              aria-label="Voltar"
            >
              <Icon name="voltar" size={24} />
            </button>
            <h1 className="csm-header__title">{title}</h1>
          </>
        ) : (
          <Logo size={28} />
        )}
      </div>

      {action && <div className="csm-header__action">{action}</div>}
    </header>
  );
}

/* ===== src/components/BottomNavigation/index.jsx ===== */
/* ============================================================
   BottomNavigation — navegação fixa no rodapé (3 destinos).
   Alvos ≥ 44px, item ativo com aria-current. A cor entra só no
   item ativo; os demais ficam neutros.
   ============================================================ */

const ITEMS = [
  { key: "home", label: "Início", icon: "casa" },
  { key: "cadastro", label: "Cadastrar", icon: "mais" },
  { key: "listagem", label: "Compra", icon: "carrinho" },
];

function BottomNavigation({ active = "home", onNavigate }) {
  return (
    <nav className="csm-bottomnav" aria-label="Navegação principal">
      <ul className="csm-bottomnav__list">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <li key={item.key} className="csm-bottomnav__item">
              <button
                type="button"
                className={`csm-bottomnav__link ${isActive ? "is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onNavigate && onNavigate(item.key)}
              >
                <Icon name={item.icon} size={24} />
                <span className="csm-bottomnav__label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ===== src/components/AlertMessage/index.jsx ===== */
/* ============================================================
   AlertMessage — feedback contextual.
   variant: success | info | alert | error
   A paleta não tem vermelho de propósito: "alert" e "error"
   usam laranja; "error" recebe peso extra. Sem borda-accent
   lateral (evitamos esse clichê) — fundo suave + ícone.
   ============================================================ */

const CONFIG = {
  success: { icon: "check-circulo", role: "status", label: "Sucesso" },
  info: { icon: "info", role: "status", label: "Informação" },
  alert: { icon: "alerta", role: "status", label: "Atenção" },
  error: { icon: "alerta", role: "alert", label: "Erro" },
};

function AlertMessage({
  variant = "info",
  title,
  children,
  onClose,
}) {
  const cfg = CONFIG[variant] || CONFIG.info;

  return (
    <div className={`csm-alert csm-alert--${variant}`} role={cfg.role}>
      <span className="csm-alert__icon" aria-hidden="true">
        <Icon name={cfg.icon} size={22} />
      </span>

      <div className="csm-alert__body">
        {title && <p className="csm-alert__title">{title}</p>}
        {children && <p className="csm-alert__text">{children}</p>}
      </div>

      {onClose && (
        <button
          type="button"
          className="csm-alert__close"
          onClick={onClose}
          aria-label="Fechar aviso"
        >
          <Icon name="fechar" size={18} />
        </button>
      )}
    </div>
  );
}

/* ===== src/components/EmptyState/index.jsx ===== */
/* ============================================================
   EmptyState — vazio amigável (catálogo, lista ou histórico).
   `icon` aceita nome do Icon (string) ou um nó pronto.
   `action` é opcional (ex.: um <Button>).
   ============================================================ */

function EmptyState({ icon = "carrinho", title, description, action }) {
  return (
    <div className="csm-empty">
      <span className="csm-empty__icon" aria-hidden="true">
        {typeof icon === "string" ? <Icon name={icon} size={32} /> : icon}
      </span>
      {title && <p className="csm-empty__title">{title}</p>}
      {description && <p className="csm-empty__desc">{description}</p>}
      {action && <div className="csm-empty__action">{action}</div>}
    </div>
  );
}

/* ===== src/pages/Home/index.jsx ===== */
/* ============================================================
   Home (/) — apresenta o app, mostra a compra em andamento
   (total + meta) se houver, e atalhos para Cadastro e Compra.
   Estado vazio amigável quando não há compra.
   ============================================================ */

function Home({
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

/* ===== src/pages/Cadastro/index.jsx ===== */
/* ============================================================
   Cadastro (/cadastro) — formulário para criar produto novo.
   Campos: nome, categoria, unidade e preço (necessário para o
   cálculo de total/subtotal). Validação inline por campo.
   ============================================================ */

function Cadastro({ onNavigate, onCreate }) {
  const [form, setForm] = React.useState({ nome: "", categoria: "", unidade: "", preco: "" });
  const [errors, setErrors] = React.useState({});
  const [sucesso, setSucesso] = React.useState(null);

  const set = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrors((er) => ({ ...er, [campo]: undefined }));
  };

  function parsePreco(txt) {
    const n = parseFloat(String(txt).replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }

  function validar() {
    const er = {};
    if (form.nome.trim().length < 2) er.nome = "Dê um nome com pelo menos 2 letras.";
    if (!form.categoria) er.categoria = "Escolha uma categoria.";
    if (!form.unidade) er.unidade = "Escolha uma unidade.";
    const p = parsePreco(form.preco);
    if (!form.preco.trim()) er.preco = "Informe o preço do produto.";
    else if (Number.isNaN(p) || p <= 0) er.preco = "Use um valor válido, ex.: 24,90.";
    return er;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const er = validar();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      setSucesso(null);
      return;
    }
    const produto = {
      id: `novo-${Date.now()}`,
      name: form.nome.trim(),
      category: form.categoria,
      unit: form.unidade,
      price: parsePreco(form.preco),
    };
    onCreate && onCreate(produto);
    setSucesso(produto.name);
    setForm({ nome: "", categoria: "", unidade: "", preco: "" });
  }

  return (
    <div className="csm-screen">
      <Header title="Novo produto" onBack={() => onNavigate && onNavigate("home")} />

      <main className="csm-screen__main">
        <form className="csm-content" onSubmit={handleSubmit} noValidate>
          {sucesso && (
            <AlertMessage variant="success" title="Pronto! Produto cadastrado."
                          onClose={() => setSucesso(null)}>
              “{sucesso}” já está disponível no catálogo.
            </AlertMessage>
          )}

          <Input
            label="Nome do produto"
            placeholder="Ex.: Arroz Tio João 5kg"
            value={form.nome}
            onChange={set("nome")}
            error={errors.nome}
            required
          />

          <Input
            as="select"
            label="Categoria"
            placeholder="Selecione a categoria"
            options={CATEGORIAS}
            value={form.categoria}
            onChange={set("categoria")}
            error={errors.categoria}
            required
          />

          <Input
            as="select"
            label="Unidade"
            placeholder="Selecione a unidade"
            options={UNIDADES}
            value={form.unidade}
            onChange={set("unidade")}
            error={errors.unidade}
            required
          />

          <Input
            label="Preço"
            placeholder="0,00"
            prefix="R$"
            inputMode="decimal"
            value={form.preco}
            onChange={set("preco")}
            error={errors.preco}
            hint="Usado para calcular o total da compra."
            required
          />

          <div className="csm-cadastro__actions">
            <Button type="submit" variant="primary" size="lg" fullWidth
                    iconLeft={<Icon name="check" size={20} />}>
              Salvar produto
            </Button>
            <Button type="button" variant="ghost" size="md" fullWidth
                    onClick={() => onNavigate && onNavigate("home")}>
              Voltar para o início
            </Button>
          </div>
        </form>
      </main>

      <BottomNavigation active="cadastro" onNavigate={onNavigate} />
    </div>
  );
}

/* ===== src/pages/Listagem/index.jsx ===== */
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

function Listagem({
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

/* ===== exposição global (preview) ===== */
Object.assign(window, {
  formatBRL, formatNum,
  CATEGORIAS, UNIDADES, ICONE_CATEGORIA, PRODUTOS, COMPRA_INICIAL, META_INICIAL, HISTORICO,
  Icon, Logo, Button, Input, Card, ProductItem, ShoppingListItem, BudgetProgress,
  Header, BottomNavigation, AlertMessage, EmptyState, Home, Cadastro, Listagem,
});
