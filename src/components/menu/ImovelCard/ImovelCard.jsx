import { Link } from "react-router-dom";
import "./ImovelCard.css";

function ImovelCard({ imovel }) {
  const imagemCapa = imovel.imagens?.[0]?.url;

const imagemCapaUrl =
  imagemCapa?.startsWith("/uploads/")
    ? `http://localhost:3000${imagemCapa}`
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
        {imagemCapa && (
          <img src={imagemCapaUrl} alt={imovel.titulo} />
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