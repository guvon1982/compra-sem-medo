import "./BudgetProgress.css";
import Icon from "../Icon";
import { formatBRL } from "../../utils/currency";

/* ============================================================
   BudgetProgress — HERÓI VISUAL. Total da compra em número
   grande + barra de meta opcional. Verde dentro da meta,
   laranja quando excede (nunca vermelho). Calcula sozinho
   o quanto falta / quanto passou.
   ============================================================ */

export default function BudgetProgress({
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
