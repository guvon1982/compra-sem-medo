/* ============================================================
   produtoService — camada que encapsula as chamadas HTTP para
   o json-server (porta 3000, recurso `/produtos`).

   Segue o padrao do exercicio do professor (aula06):
   - 5 funcoes exportadas: criar / obter / listar / atualizar / remover
   - cada uma usa `fetch` com `try/catch`
   - em caso de erro, devolve `{ message: "Deu ruim! ..." }` em vez
     de jogar excecao — quem chamar checa o campo `message`.

   Em producao usariamos uma API real e biblioteca tipo axios/ky com
   tratamento de erro estruturado, mas para o MVP esse formato basta
   e mantem o codigo coerente com o que o professor vai corrigir.
   ============================================================ */

// Base da API lida de variavel de ambiente (Vite expoe tudo que comeca
// com VITE_). Em dev, se nada for definido, cai no json-server local.
// Em producao, defina VITE_API_URL no build apontando para a API real.
// Ver `.env.example` na raiz do projeto.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const url = `${BASE_URL}/produtos`;

// Helper interno: monta uma mensagem de erro em portugues, curta e
// orientada ao que o usuario pode fazer.
//
// O `fetch` joga um TypeError quando nao consegue alcancar o servidor
// (API offline, sem rede, CORS bloqueado). Esse e o caso mais comum
// no nosso projeto — entao tratamos ele com mensagem dedicada.
// Qualquer outra coisa cai num fallback generico, ainda em portugues.
function mensagemErro(error) {
  if (error instanceof TypeError) {
    return "Sem conexao com a API. Verifique se o servidor esta no ar.";
  }
  return `Nao foi possivel completar a operacao: ${error.message}`;
}

// POST /
export async function criar(produto) {
  try {
    const resposta = await fetch(url, {
      method: "POST",
      body: JSON.stringify(produto),
      headers: { "content-type": "application/json" },
    });
    return await resposta.json();
  } catch (error) {
    return { message: mensagemErro(error) };
  }
}

// GET /id
export async function obter(produto) {
  try {
    const resposta = await fetch(`${url}/${produto.id}`);
    return await resposta.json();
  } catch (error) {
    return { message: mensagemErro(error) };
  }
}

// GET /
export async function listar() {
  try {
    const resposta = await fetch(url);
    return await resposta.json();
  } catch (error) {
    return { message: mensagemErro(error) };
  }
}

// PUT /id
export async function atualizar(produto) {
  try {
    const resposta = await fetch(`${url}/${produto.id}`, {
      method: "PUT",
      body: JSON.stringify(produto),
      headers: { "content-type": "application/json" },
    });
    return await resposta.json();
  } catch (error) {
    return { message: mensagemErro(error) };
  }
}

// DELETE /id
export async function remover(produto) {
  try {
    const resposta = await fetch(`${url}/${produto.id}`, {
      method: "DELETE",
    });
    return await resposta.json();
  } catch (error) {
    return { message: mensagemErro(error) };
  }
}
