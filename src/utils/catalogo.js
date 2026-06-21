/* ============================================================
   Helpers puros para regras do catalogo de produtos.
   ============================================================ */

/**
 * Normaliza uma string para comparacao tolerante a maiusculas,
 * espacos nas pontas e acentos. Usado tanto na busca quanto na
 * checagem de unicidade (RN2 do PRD).
 *
 * Tecnica: NFD decompoe "ã" em "a" + caractere combinante "~"; a
 * regex remove combinantes (faixa Unicode U+0300 a U+036F).
 * Resultado: "Açúcar União" e "acucar uniao" sao considerados
 * iguais.
 */
export function normalizar(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

/**
 * Detecta se ja existe outro produto com o mesmo nome no catalogo.
 *
 * Implementa a RN2 do PRD ("nome unico, case-insensitive, ignorando
 * espacos nas pontas") com uma leitura mais estrita: tambem ignora
 * acentuacao para casar com a expectativa do usuario brasileiro
 * (igual a busca textual). Sem isso, "Açúcar União" e "Acucar Uniao"
 * passariam como produtos diferentes — ambos sao a mesma coisa.
 *
 * Em modo edicao, o proprio produto sendo editado e ignorado
 * (passar idAtual = produto.id); em modo criar, passar undefined.
 */
export function temNomeDuplicado(nome, produtos, idAtual) {
  const alvo = normalizar(nome);
  return produtos.some(
    (p) => normalizar(p.nome) === alvo && p.id !== idAtual,
  );
}
