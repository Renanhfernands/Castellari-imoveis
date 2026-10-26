import { Link } from "react-router-dom";
import "./ImovelCard.css";

const API_URL = "https://castellari-imoveis.onrender.com";

function ImovelCard({ imovel }) {
  // A imagem do CARD vem exclusivamente da imagem de capa
  const imagemCapa = imovel.imagem_capa;

  const imagemCapaUrl =
    imagemCapa?.startsWith("/uploads/")
      ? `${API_URL}${imagemCapa}`
      : imagemCapa;

  const precoFormatado =
    imovel.preco !== null && imovel.preco !== undefined
      ? Number(imovel.preco).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "";

  const areaFormatada =
    imovel.area !== null && imovel.area !== undefined
      ? `${imovel.area} m²`
      : "";

  return (
    <article className="imovel-card">

      <div className="imovel-image">
        {imagemCapaUrl && (
          <img
            src={imagemCapaUrl}
            alt={imovel.titulo}
          />
        )}
      </div>

      <div className="imovel-info">

        <span>{imovel.tipo}</span>

        <h2>{imovel.titulo}</h2>

        <p>{imovel.localizacao}</p>

        <div className="imovel-details">

          {imovel.quartos !== null &&
            imovel.quartos !== undefined && (
              <span>
                {imovel.quartos} quartos
              </span>
            )}

          {imovel.vagas !== null &&
            imovel.vagas !== undefined && (
              <span>
                {imovel.vagas} vagas
              </span>
            )}

          {areaFormatada && (
            <span>
              {areaFormatada}
            </span>
          )}

        </div>

        <strong>
          {precoFormatado}
        </strong>

        <Link
          to={`/imoveis/${imovel.id}`}
          className="imovel-button"
        >
          VER IMÓVEL
        </Link>

      </div>

    </article>
  );
}

export default ImovelCard;