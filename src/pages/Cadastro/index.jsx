import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import "./Cadastro.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Icon from "../../components/Icon";
import { CATEGORIAS, UNIDADES } from "../../data/mock";
import { parsePreco } from "../../utils/currency";
import { temNomeDuplicado } from "../../utils/catalogo";
import { useCatalogo } from "../../contexts/CatalogoContext";
import { useCompra } from "../../contexts/CompraContext";
import * as produtoService from "../../services/produtoService";

/* ============================================================
   Cadastro — formulario que cria, edita OU remove produto.

   Duas rotas batem aqui:
   - /cadastro       -> modo "criar"
   - /cadastro/:id   -> modo "editar"

   O formulario usa react-hook-form (mesma lib da aula06 do
   professor). Como os campos sao renderizados pelo nosso
   componente controlado <Input>, usamos <Controller> — a forma
   recomendada pela lib para integrar componentes controlados
   customizados. As regras de validacao (rules) preservam o
   comportamento anterior: nome unico (RN2), preco > 0, e os
   campos obrigatorios. handleSubmit so chama onValid quando
   tudo passa.

   Em modo editar, na montagem chamamos produtoService.obter(id)
   e usamos reset() para pre-preencher o form.

   No rodape do form em modo editar mora a "zona perigosa":
   botao "Excluir produto". Politica de orfao: se o produto
   estiver na compraAtual, o clique nao abre o modal — mostra
   um aviso inline com link para a Listagem aba Minha compra.
   Quando livre, abre um modal de confirmacao (foco vai pro
   botao destrutivo, igual ao padrao do modal de finalizar).
   ============================================================ */

const FORM_VAZIO = { nome: "", categoria: "", unidade: "", preco: "" };

export default function Cadastro() {
  const navigate = useNavigate();
  const { id } = useParams();
  const modoEdicao = Boolean(id);

  const { produtos, adicionarProduto, editarProduto, removerProduto } = useCatalogo();
  const { compraAtual } = useCompra();

  // react-hook-form: control liga os <Controller> ao form; handleSubmit
  // valida antes de chamar onValid; reset preenche/limpa os campos;
  // getValues("nome") da o valor atual do nome (leitura pontual, usada no
  // titulo do modal de exclusao); errors traz as mensagens por campo.
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues: FORM_VAZIO });

  const [sucesso, setSucesso] = useState(null);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // Estado da carga inicial em modo edicao
  const [carregando, setCarregando] = useState(modoEdicao);
  const [naoEncontrado, setNaoEncontrado] = useState(false);

  // Estado da exclusao (so usado em modo edicao)
  const [bloqueadoOrfao, setBloqueadoOrfao] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState(null);

  // Produto esta na compra atual? -> bloqueia exclusao.
  const produtoEstaNaCompra =
    modoEdicao && compraAtual.some((e) => e.id === id);

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

      reset({
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
  }, [id, modoEdicao, reset]);

  // Acessibilidade do modal de exclusao: ao abrir, foco vai para o botao
  // destrutivo; ao fechar (depois de aberto), volta para o botao Excluir
  // que abriu o modal. Mesmo padrao do modal de finalizar na Listagem.
  const excluirBotaoRef = useRef(null);
  const confirmarExcluirBotaoRef = useRef(null);
  const modalJaAbriu = useRef(false);

  useEffect(() => {
    if (confirmandoExclusao) {
      modalJaAbriu.current = true;
      confirmarExcluirBotaoRef.current?.focus();
    } else if (modalJaAbriu.current) {
      excluirBotaoRef.current?.focus();
    }
  }, [confirmandoExclusao]);

  // Validacao do nome: cobre vazio/curto E a regra RN2 (nome unico).
  // Em modo edicao, passamos `id` para temNomeDuplicado nao acusar o
  // proprio produto como duplicado.
  function validarNome(valor) {
    const nome = (valor || "").trim();
    if (nome.length < 2) return "Dê um nome com pelo menos 2 letras.";
    if (temNomeDuplicado(nome, produtos, id)) {
      return "Já existe um produto com esse nome no catálogo.";
    }
    return true;
  }

  // Validacao do preco: usa parsePreco (aceita "24,90", "1.234,56" etc.)
  // e rejeita vazio, NaN ou valores <= 0 (RN5).
  function validarPreco(valor) {
    if (!(valor || "").trim()) return "Informe o preço do produto.";
    const p = parsePreco(valor);
    if (Number.isNaN(p) || p <= 0) return "Use um valor válido, ex.: 24,90.";
    return true;
  }

  // Chamada pelo handleSubmit do react-hook-form apenas quando TODOS os
  // campos passam na validacao. `values` ja vem com os campos do form.
  async function onValid(values) {
    const nomeProduto = values.nome.trim();
    const dados = {
      nome: nomeProduto,
      categoria: values.categoria,
      unidade: values.unidade,
      preco: parsePreco(values.preco),
    };

    setEnviando(true);
    setErroEnvio(null);
    try {
      if (modoEdicao) {
        await editarProduto(id, dados);
        setSucesso(nomeProduto);
      } else {
        await adicionarProduto(dados);
        setSucesso(nomeProduto);
        reset(FORM_VAZIO);
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

  // Chamada quando o submit falha na validacao: limpa avisos antigos para
  // a tela mostrar so os erros de campo (espelha o comportamento anterior).
  function onInvalid() {
    setSucesso(null);
    setErroEnvio(null);
  }

  // "Excluir produto" no rodape do form -> decide se abre o modal ou
  // mostra aviso de orfao. Tambem limpa qualquer aviso anterior.
  function handleSolicitarExclusao() {
    setSucesso(null);
    setErroExclusao(null);
    if (produtoEstaNaCompra) {
      setBloqueadoOrfao(true);
      return;
    }
    setBloqueadoOrfao(false);
    setConfirmandoExclusao(true);
  }

  async function handleConfirmarExclusao() {
    setExcluindo(true);
    setErroExclusao(null);
    try {
      await removerProduto(id);
      // Apos remover, volta para Listagem aba Catalogo (onde o usuario
      // veio). O modal fecha sozinho porque o componente desmonta.
      navigate("/listagem", { state: { aba: "catalogo" } });
    } catch (err) {
      setErroExclusao(
        err?.message ||
          "Não foi possível excluir o produto. Tente novamente em instantes.",
      );
      setExcluindo(false);
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
          <form className="csm-content" onSubmit={handleSubmit(onValid, onInvalid)} noValidate>
            {erroEnvio && (
              <AlertMessage
                variant="error"
                title="Não foi possível salvar"
                onClose={() => setErroEnvio(null)}
              >
                {erroEnvio}
              </AlertMessage>
            )}
            {bloqueadoOrfao && (
              <section
                className="csm-cadastro__bloqueio"
                aria-label="Exclusão bloqueada"
              >
                <AlertMessage
                  variant="alert"
                  title="Não dá pra excluir esse produto agora"
                  onClose={() => setBloqueadoOrfao(false)}
                >
                  Ele está na sua compra atual. Remova-o da compra antes de
                  excluir do catálogo.
                </AlertMessage>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    navigate("/listagem", { state: { aba: "compra" } })
                  }
                  iconRight={<Icon name="avancar" size={16} />}
                >
                  Ver minha compra
                </Button>
              </section>
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

            <Controller
              name="nome"
              control={control}
              rules={{ validate: validarNome }}
              render={({ field }) => (
                <Input
                  label="Nome do produto"
                  placeholder="Ex.: Arroz Tio João 5kg"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.nome?.message}
                  required
                />
              )}
            />

            <Controller
              name="categoria"
              control={control}
              rules={{ required: "Escolha uma categoria." }}
              render={({ field }) => (
                <Input
                  as="select"
                  label="Categoria"
                  placeholder="Selecione a categoria"
                  options={CATEGORIAS}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.categoria?.message}
                  required
                />
              )}
            />

            <Controller
              name="unidade"
              control={control}
              rules={{ required: "Escolha uma unidade." }}
              render={({ field }) => (
                <Input
                  as="select"
                  label="Unidade"
                  placeholder="Selecione a unidade"
                  options={UNIDADES}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.unidade?.message}
                  required
                />
              )}
            />

            <Controller
              name="preco"
              control={control}
              rules={{ validate: validarPreco }}
              render={({ field }) => (
                <Input
                  label="Preço"
                  placeholder="0,00"
                  prefix="R$"
                  inputMode="decimal"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={errors.preco?.message}
                  hint="Usado para calcular o total da compra."
                  required
                />
              )}
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

            {modoEdicao && (
              <div className="csm-cadastro__danger">
                <p className="csm-cadastro__danger-title">Zona de risco</p>
                <Button
                  ref={excluirBotaoRef}
                  type="button"
                  variant="danger"
                  size="md"
                  fullWidth
                  iconLeft={<Icon name="lixeira" size={20} />}
                  onClick={handleSolicitarExclusao}
                >
                  Excluir produto
                </Button>
              </div>
            )}
          </form>
        )}
      </main>

      <BottomNavigation />

      {/* Modal de confirmacao da exclusao */}
      {confirmandoExclusao && (
        <div
          className="csm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="csm-cadastro-excluir-title"
        >
          <div
            className="csm-modal__backdrop"
            onClick={() => !excluindo && setConfirmandoExclusao(false)}
          />
          <Card padding="lg" className="csm-modal__card">
            <h2
              className="csm-modal__title"
              id="csm-cadastro-excluir-title"
            >
              Excluir “{getValues("nome")}”?
            </h2>
            <p className="csm-modal__text">
              Essa ação não pode ser desfeita. O produto vai sair do catálogo.
            </p>
            {erroExclusao && (
              <AlertMessage
                variant="error"
                title="Não foi possível excluir"
                onClose={() => setErroExclusao(null)}
              >
                {erroExclusao}
              </AlertMessage>
            )}
            <div className="csm-modal__actions">
              <Button
                ref={confirmarExcluirBotaoRef}
                variant="danger"
                size="lg"
                fullWidth
                iconLeft={<Icon name="lixeira" size={20} />}
                onClick={handleConfirmarExclusao}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo..." : "Sim, excluir"}
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => setConfirmandoExclusao(false)}
                disabled={excluindo}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
