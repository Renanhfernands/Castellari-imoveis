import { BrowserRouter, Routes, Route } from "react-router-dom";

import CastellariLanding from "./components/menu/CastellariLanding/CastellariLanding";

import Imoveis from "./pages/Imoveis/Imoveis";
import ImovelDetalhes from "./pages/Imoveis/Imoveis/Detalhes/ImovelDetalhes";

import Admin from "./pages/Imoveis/Admin/admin";
import NovoImovel from "./pages/Imoveis/Admin/NovoImovel";
import EditarImovel from "./pages/Imoveis/Admin/EditarImovel";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
  path="/admin/imoveis/:id/editar"
  element={<EditarImovel />}
/>

        {/* Página inicial */}
        <Route
          path="/"
          element={<CastellariLanding />}
        />

        {/* Lista de imóveis */}
        <Route
          path="/imoveis"
          element={<Imoveis />}
        />

        {/* Detalhes do imóvel */}
        <Route
          path="/imoveis/:id"
          element={<ImovelDetalhes />}
        />

        {/* Administração */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        {/* Cadastro de novo imóvel */}
        <Route
          path="/admin/imoveis/novo"
          element={<NovoImovel />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;