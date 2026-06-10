import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import "./Cadastro.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import { CATEGORIAS, UNIDADES } from "../../data/mock";
import { parsePreco } from "../../utils/currency";
import { useCatalogo } from "../../contexts/CatalogoContext";
import * as produtoService from "../../services/produtoService";

/* ============================================================
   Cadastro — formulario que cria OU edita produto.

   Duas rotas batem aqui:
   - /cadastro       -> modo "criar"
   - /cadastro/:id   -> modo "editar" (id vem pelos useParams)

   Em modo editar, na montagem chamamos produtoService.obter(id)
   para pre-preencher o form (padrao da aula06 do professor).
   Submit despacha editarProduto OU adicionarProduto no Context.
   ============================================================ */

const FORM_VAZIO = { nome: "", categoria: "", unidade: "", preco: "" };

export default function Cadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const modoEdicao = Boolean(id);

  const { adicionarProduto, editarProduto } = useCatalogo();
  const [form, setForm] = useState(FORM_VAZIO);
  const [errors, setErrors] = useState({});
  const [sucesso, setSucesso] = useState(null);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Estado da carga inicial em modo edicao
  const [carregando, setCarregando] = useState(modoEdicao);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Em modo edicao: busca o produto na API e pre-preenche o form.
  // A flag `cancelado` evita atualizar estado se o componente desmontar
  // antes da resposta chegar (mesmo padrao do CatalogoContext).
  useEffect(() => {
    if (!modoEdicao) return;
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErroEnvio(null);
      setNaoEncontrado(false);

      const resp = await produtoService.obter({ id });
      if (cancelado) return;

      // Erro de rede: service devolve { message } sem id
      if (resp?.message && !resp?.id) {
        setErroEnvio(resp.message);
        setCarregando(false);
        return;
      }

      // json-server devolve {} quando o id nao existe
      if (!resp || !resp.id) {
        setNaoEncontrado(true);
        setCarregando(false);
        return;
      }

      setForm({
        nome: resp.nome ?? "",
        categoria: resp.categoria ?? "",
        unidade: resp.unidade ?? "",
        // preco vem como number; convertemos para string com virgula para
        // o usuario editar no mesmo formato que digita ao criar
        preco: resp.preco != null ? String(resp.preco).replace(".", ",") : "",
      });
      setCarregando(false);
    }

    carregar();
    return () => { cancelado = true; };
  }, [id, modoEdicao]);

  const set = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrors((er) => ({ ...er, [campo]: undefined }));
  };

  function validar() {
    const er = {};
    if (form.nome.trim().length < 2) er.nome = "Dê um nome com pelo menos 2 letras.";
    if (!form.categoria) er.categoria = "Escolha uma categoria.";
    if (!form.unidade) er.unidade = "Escolha uma unidade.";
    const p = parsePreco(form.preco);
    if (!form.preco.trim()) er.preco = "Informe o preço do produto.";
    else if (Number.isNaN(p) || p <= 0) er.preco = "Use um valor válido, ex.: 24,90.";
    return er;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const er = validar();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      setSucesso(null);
      setErroEnvio(null);
      return;
    }
    const nomeProduto = form.nome.trim();
    const dados = {
      nome: nomeProduto,
      categoria: form.categoria,
      unidade: form.unidade,
      preco: parsePreco(form.preco),
    };

    setEnviando(true);
    setErroEnvio(null);
    try {
      if (modoEdicao) {
        await editarProduto(id, dados);
        setSucesso(nomeProduto);
        // Em edicao nao limpamos o form — o usuario pode querer continuar
        // ajustando. O alerta de sucesso ja confirma a acao.
      } else {
        await adicionarProduto(dados);
        setSucesso(nomeProduto);
        setForm(FORM_VAZIO);
      }
    } catch (err) {
      setSucesso(null);
      setErroEnvio(
        err?.message ||
          "Não foi possível salvar o produto. Tente novamente em instantes.",
      );
    } finally {
      setEnviando(false);
    }
  }

  const tituloHeader = modoEdicao ? "Editar produto" : "Novo produto";

  return (
    <div className="csm-screen">
      <Header
        title={tituloHeader}
        onBack={() => navigate(modoEdicao ? "/listagem" : "/")}
      />

      <main className="csm-screen__main">
        {carregando ? (
          <div className="csm-content">
            <EmptyState
              icon="caixa"
              title="Carregando produto..."
              description="Buscando os dados no servidor."
            />
          </div>
        ) : naoEncontrado ? (
          <div className="csm-content">
            <EmptyState
              icon="busca"
              title="Produto não encontrado"
              description="Esse produto pode ter sido removido ou o link está incorreto."
              action={
                <Button
                  variant="primary"
                  onClick={() => navigate("/listagem", { state: { aba: "catalogo" } })}
                  iconRight={<Icon name="avancar" size={20} />}
                >
                  Ver catálogo
                </Button>
              }
            />
          </div>
        ) : (
          <form className="csm-content" onSubmit={handleSubmit} noValidate>
            {erroEnvio && (
              <AlertMessage
                variant="error"
                title="Não foi possível salvar"
                onClose={() => setErroEnvio(null)}
              >
                {erroEnvio}
              </AlertMessage>
            )}
            {sucesso && (
              <section
                className="csm-cadastro__sucesso"
                aria-label={modoEdicao ? "Edição concluída" : "Cadastro concluído"}
              >
                <AlertMessage
                  variant="success"
                  title={
                    modoEdicao
                      ? "Produto atualizado com sucesso!"
                      : "Produto cadastrado com sucesso!"
                  }
                  onClose={() => setSucesso(null)}
                >
                  {modoEdicao
                    ? `As mudanças em “${sucesso}” foram salvas.`
                    : `Adicionamos “${sucesso}” ao seu catálogo.`}
                </AlertMessage>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate("/listagem", { state: { aba: "catalogo" } })
                  }
                  iconRight={<Icon name="avancar" size={16} />}
                >
                  Ver no catálogo
                </Button>
              </section>
            )}

            <Input
              label="Nome do produto"
              placeholder="Ex.: Arroz Tio João 5kg"
              value={form.nome}
              onChange={set("nome")}
              error={errors.nome}
              required
            />

            <Input
              as="select"
              label="Categoria"
              placeholder="Selecione a categoria"
              options={CATEGORIAS}
              value={form.categoria}
              onChange={set("categoria")}
              error={errors.categoria}
              required
            />

            <Input
              as="select"
              label="Unidade"
              placeholder="Selecione a unidade"
              options={UNIDADES}
              value={form.unidade}
              onChange={set("unidade")}
              error={errors.unidade}
              required
            />

            <Input
              label="Preço"
              placeholder="0,00"
              prefix="R$"
              inputMode="decimal"
              value={form.preco}
              onChange={set("preco")}
              error={errors.preco}
              hint="Usado para calcular o total da compra."
              required
            />

            <div className="csm-cadastro__actions">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                iconLeft={<Icon name="check" size={20} />}
                disabled={enviando}
              >
                {enviando
                  ? "Salvando..."
                  : modoEdicao
                    ? "Salvar alterações"
                    : "Salvar produto"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => navigate(modoEdicao ? "/listagem" : "/")}
              >
                {modoEdicao ? "Cancelar" : "Voltar para o início"}
              </Button>
            </div>
          </form>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
