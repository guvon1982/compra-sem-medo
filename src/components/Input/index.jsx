import { useId } from "react";
import Icon from "../Icon";
import "./Input.css";

/* ============================================================
   Input — campo de formulário acessível.
   <label htmlFor> sempre ligado ao controle. Validação inline
   via prop `error`. `hint` para ajuda. Suporta input | select |
   textarea pela prop `as` (categoria/unidade da tela Cadastro
   usam o mesmo componente).

   onClear (opcional): quando passada E o campo tem valor,
   renderiza um botao "X" dentro do campo para limpar a busca
   sem precisar segurar backspace. Util em campos de busca no
   mobile (padrao de UX dos apps nativos).
   ============================================================ */

export default function Input({
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
  onClear,
  ...rest
}) {
  const autoId = useId();
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

      <div className={`csm-input__field ${prefix ? "has-prefix" : ""} ${onClear && value ? "has-clear" : ""}`}>
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

        {onClear && value && as === "input" && (
          <button
            type="button"
            className="csm-input__clear"
            onClick={onClear}
            aria-label={`Limpar ${label || "campo"}`}
          >
            <Icon name="fechar" size={16} />
          </button>
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
