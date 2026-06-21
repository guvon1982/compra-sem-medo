import { useNavigate } from "react-router";
import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

/* ============================================================
   NotFound — tela mostrada quando a URL nao bate com nenhuma
   rota conhecida (rota catch-all "*" no App). Evita a tela
   branca em links errados/antigos e oferece um caminho de
   volta para o inicio.

   Reusa o shell padrao (csm-screen + Header + BottomNavigation)
   e o EmptyState para manter a aparencia consistente com o
   resto do app. O Header com `title` ja renderiza o <h1>, entao
   nao adicionamos outro cabecalho de nivel 1 aqui.
   ============================================================ */

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="csm-screen">
      <Header title="Página não encontrada" />

      <main className="csm-screen__main">
        <div className="csm-content">
          <EmptyState
            icon="busca"
            title="Esta página não existe"
            description="O endereço que você abriu não corresponde a nenhuma tela do app. Pode ser um link antigo ou digitado errado."
            action={
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/")}
                iconLeft={<Icon name="voltar" size={20} />}
              >
                Voltar para o início
              </Button>
            }
          />
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
