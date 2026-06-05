import "./Cadastro.css";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AlertMessage from "../../components/AlertMessage";
import Icon from "../../components/Icon";
import { CATEGORIAS, UNIDADES } from "../../data/mock";

/* ============================================================
   Cadastro (/cadastro) — formulário para criar produto novo.
   Campos: nome, categoria, unidade e preço (necessário para o
   cálculo de total/subtotal). Validação inline por campo.
   ============================================================ */

export default function Cadastro({ onNavigate, onCreate }) {
  const [form, setForm] = React.useState({ nome: "", categoria: "", unidade: "", preco: "" });
  const [errors, setErrors] = React.useState({});
  const [sucesso, setSucesso] = React.useState(null);

  const set = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErrors((er) => ({ ...er, [campo]: undefined }));
  };

  function parsePreco(txt) {
    const n = parseFloat(String(txt).replace(/\./g, "").replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }

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
    const produto = {
      id: `novo-${Date.now()}`,
      name: form.nome.trim(),
      category: form.categoria,
      unit: form.unidade,
      price: parsePreco(form.preco),
    };
    onCreate && onCreate(produto);
    setSucesso(produto.name);
    setForm({ nome: "", categoria: "", unidade: "", preco: "" });
  }

  return (
    <div className="csm-screen">
      <Header title="Novo produto" onBack={() => onNavigate && onNavigate("home")} />

      <main className="csm-screen__main">
        <form className="csm-content" onSubmit={handleSubmit} noValidate>
          {sucesso && (
            <AlertMessage variant="success" title="Pronto! Produto cadastrado."
                          onClose={() => setSucesso(null)}>
              “{sucesso}” já está disponível no catálogo.
            </AlertMessage>
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
            <Button type="submit" variant="primary" size="lg" fullWidth
                    iconLeft={<Icon name="check" size={20} />}>
              Salvar produto
            </Button>
            <Button type="button" variant="ghost" size="md" fullWidth
                    onClick={() => onNavigate && onNavigate("home")}>
              Voltar para o início
            </Button>
          </div>
        </form>
      </main>

      <BottomNavigation active="cadastro" onNavigate={onNavigate} />
    </div>
  );
}
