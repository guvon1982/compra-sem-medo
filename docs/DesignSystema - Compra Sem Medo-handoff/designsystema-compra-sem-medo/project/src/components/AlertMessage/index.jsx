import "./AlertMessage.css";
import Icon from "../Icon";

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

export default function AlertMessage({
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
