import "./Button.css";

/* ============================================================
   Button — uma única fonte de verdade, variantes por prop.
   variant: primary | secondary | ghost | danger
   size:    sm | md | lg
   Props:   fullWidth, loading, disabled, iconLeft, iconRight, type
   Acessível: <button> real, alvo ≥ 44px (md/lg), foco visível.
   ============================================================ */

export default function Button({
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
