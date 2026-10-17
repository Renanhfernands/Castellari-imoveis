import { Link } from "react-router-dom";
import "./ImovelCard.css";

function ImovelCard({ imovel }) {
  return (
    <article className="imovel-card">
      <div className="imovel-image">
        <img
          src={imovel.imagens?.[0]}
          alt={imovel.titulo}
        />
      </div>

      <div className="imovel-info">
        <span>{imovel.tipo}</span>

        <h2>{imovel.titulo}</h2>

        <p>{imovel.localizacao}</p>

        <div className="imovel-details">
          <span>{imovel.detalhes.quartos} quartos</span>
          <span>{imovel.detalhes.vagas} vagas</span>
          <span>{imovel.detalhes.area}</span>
        </div>

        <strong>{imovel.preco}</strong>

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