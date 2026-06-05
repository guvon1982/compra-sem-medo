import "./Icon.css";

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

export default function Icon({ name, size = 24, className = "", strokeWidth = 2, ...rest }) {
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
