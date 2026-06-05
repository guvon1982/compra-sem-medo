import "./Card.css";

/* ============================================================
   Card — superfície de conteúdo. Borda fina por padrão
   (preferida a sombra). `as` para semântica (<section>,
   <article>...). `interactive` quando o card inteiro é clicável.
   variant: default | muted
   padding: none | sm | md | lg
   ============================================================ */

export default function Card({
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
