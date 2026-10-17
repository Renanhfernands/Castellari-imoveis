import { BrowserRouter, Routes, Route } from "react-router-dom";
import CastellariLanding from "./components/menu/CastellariLanding/CastellariLanding";
import Imoveis from "./pages/Imoveis/Imoveis";
import ImovelDetalhes from "./pages/Imoveis/Imoveis/Detalhes/ImovelDetalhes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<CastellariLanding />}
        />

        <Route
          path="/imoveis"
          element={<Imoveis />}
        />

        <Route
          path="/imoveis/:id"
          element={<ImovelDetalhes />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;