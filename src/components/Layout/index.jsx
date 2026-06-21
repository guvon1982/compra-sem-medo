import { Outlet } from "react-router";
import AlertMessage from "../AlertMessage";
import { useCompra } from "../../contexts/CompraContext";
import "./Layout.css";

/* ============================================================
   Layout — envolve todas as rotas via react-router Outlet.
   Renderiza avisos globais (ex.: estado corrompido no
   localStorage) ANTES da tela atual, garantindo que o usuario
   ve o aviso independente de qual rota carregou primeiro
   (Home, Listagem, Cadastro). Antes do PR de polimento, o
   aviso vivia apenas na Home e podia passar batido em
   deep-link direto para outra rota.
   ============================================================ */

export default function Layout() {
  const { erroStorage, descartarErroStorage } = useCompra();

  return (
    <>
      {erroStorage && (
        <div className="csm-layout__banner">
          <AlertMessage
            variant="alert"
            title="Sua compra anterior não pôde ser recuperada"
            onClose={descartarErroStorage}
          >
            Os dados salvos estavam em um formato inválido, então começamos do zero. Seu histórico e meta também foram resetados.
          </AlertMessage>
        </div>
      )}
      <Outlet />
    </>
  );
}
