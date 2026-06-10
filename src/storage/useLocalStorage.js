import { useState, useEffect } from "react";

/**
 * Hook genérico que funciona como useState, mas salva o valor no
 * localStorage automaticamente. Ao recarregar a página, o valor
 * anterior é restaurado.
 *
 * @param {string} chave       - nome único da entrada no localStorage
 * @param {*}      valorInicial - valor usado quando ainda não há nada salvo
 */
export function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(chave);
      return item !== null ? JSON.parse(item) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // silencia erros de modo privado ou storage cheio
    }
  }, [chave, valor]);

  return [valor, setValor];
}

/**
 * Lê uma entrada do localStorage sem criar estado React.
 * Útil para inicializar um useReducer (lazy initializer).
 *
 * @param {string} chave       - nome da entrada no localStorage
 * @param {*}      valorPadrao - retornado quando a chave não existe ou o JSON está corrompido
 */
export function lerDoStorage(chave, valorPadrao) {
  try {
    const item = localStorage.getItem(chave);
    return item !== null ? JSON.parse(item) : valorPadrao;
  } catch {
    return valorPadrao;
  }
}
