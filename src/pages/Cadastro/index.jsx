import { useState } from "react";
import { useNavigate } from "react-router";
import "./Cadastro.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import Icon from "../../components/Icon";
import { CATEGORIAS, UNIDADES } from "../../data/mock";
import { parsePreco } from "../../utils/currency";
import { useCatalogo } from "../../contexts/CatalogoContext";

/* ============================================================
   Cadastro (/cadastro) — formulario para criar produto novo.
   Campos: nome, categoria, unidade e preco (necessario para o
   calculo de total/subtotal). Validacao inline por campo.

   Apos validar, despacha `adicionarProduto` no CatalogoContext,
   entao o produto novo passa a aparecer no catalogo da Listagem.
   A persistencia em backend/localStorage vem nas proximas fases.
   ============================================================ */

export default function Cadastro() {
  const navigate = useNavigate();
  const { adicionarProduto } = useCatalogo();
  const [form, setForm] = useState({ nome: "", categoria: "", unidade: "", preco: "" });
  const [errors, setErrors] = useState({});
  const [sucesso, setSucesso] = useState(null);

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

  function handleSubmit(e) {
    e.preventDefault();
    const er = validar();
    setErrors(er);
    if (Object.keys(er).length > 0) {
      setSucesso(null);
      return;
    }
    // Persiste no catalogo via Context — Listagem ja vai enxergar este produto.
    adicionarProduto({
      name: form.nome.trim(),
      category: form.categoria,
      unit: form.unidade,
      price: parsePreco(form.preco),
    });
    setSucesso(form.nome.trim());
    setForm({ nome: "", categoria: "", unidade: "", preco: "" });
  }

  return (
    <div className="csm-screen">
      <Header title="Novo produto" onBack={() => navigate("/")} />

      <main className="csm-screen__main">
        <form className="csm-content" onSubmit={handleSubmit} noValidate>
          {sucesso && (
            <section
              className="csm-cadastro__sucesso"
              aria-label="Cadastro concluido"
            >
              <AlertMessage
                variant="success"
                title="Produto cadastrado com sucesso!"
                onClose={() => setSucesso(null)}
              >
                Adicionamos “{sucesso}” ao seu catálogo.
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
            >
              Salvar produto
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => navigate("/")}
            >
              Voltar para o início
            </Button>
          </div>
        </form>
      </main>

      <BottomNavigation />
    </div>
  );
}
