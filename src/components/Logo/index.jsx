import "./Logo.css";

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

export default function Logo({ variant = "full", size = 30, className = "" }) {
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
