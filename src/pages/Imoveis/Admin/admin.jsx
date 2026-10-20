import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./admin.css";
import { buscarImoveis } from "../../../services/api";

export default function Admin() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarImoveis() {
      try {
        setCarregando(true);
        setErro(false);

        const dados = await buscarImoveis();

        setImoveis(dados);
      } catch (error) {
        console.error("Erro ao buscar imóveis:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarImoveis();
  }, []);

  return (
    <main className="admin">
      <div className="admin-container">

        <div className="admin-header">
          <div>
            <span className="admin-label">
              ADMINISTRAÇÃO
            </span>

            <h1>Painel de Imóveis</h1>

            <p>
              Gerencie os imóveis cadastrados no Castellari Imóveis.
            </p>
          </div>

          <Link
            to="/admin/imoveis/novo"
            className="admin-button"
          >
            + Novo imóvel
          </Link>
        </div>

        <section className="admin-content">

          {carregando && (
            <p>Carregando imóveis...</p>
          )}

          {erro && (
            <p>
              Não foi possível carregar os imóveis.
            </p>
          )}

          {!carregando && !erro && imoveis.length === 0 && (
            <p>
              Nenhum imóvel cadastrado.
            </p>
          )}

          {!carregando &&
            !erro &&
            imoveis.map((imovel) => (
              <div
                className="admin-card"
                key={imovel.id}
              >
                <div>
                  <span className="admin-label">
                    {imovel.tipo}
                  </span>

                  <strong>
                    {imovel.titulo}
                  </strong>

                  <p>
                    {imovel.localizacao}
                  </p>

                  <p>
                    R$ {Number(imovel.preco).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div>

                  {/* VER IMÓVEL */}
                  <Link
                    to={`/imoveis/${imovel.id}`}
                    className="admin-button"
                  >
                    Ver imóvel
                  </Link>

                  {/* EDITAR IMÓVEL */}
                  <Link
                    to={`/admin/imoveis/${imovel.id}/editar`}
                    className="admin-button"
                  >
                    Editar
                  </Link>

                </div>
              </div>
            ))}

        </section>

      </div>
    </main>
  );
}