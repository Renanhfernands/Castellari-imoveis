import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ImovelDetalhes.css";
import { buscarImovel } from "../../../../services/api";

export default function ImovelDetalhes() {
  const { id } = useParams();

  const [imovel, setImovel] = useState(null);
  const [fotoAtual, setFotoAtual] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    async function carregarImovel() {
      try {
        setCarregando(true);
        setErro(false);

        const dados = await buscarImovel(id);

        setImovel(dados);
        setFotoAtual(0);
      } catch (error) {
        console.error("Erro ao buscar imóvel:", error);
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarImovel();
  }, [id]);

  /*
    CARREGANDO
  */

  if (carregando) {
    return (
      <main className="imovel-detalhes">
        <div className="imovel-detalhes-container">
          <p>Carregando imóvel...</p>
        </div>
      </main>
    );
  }

  /*
    ERRO / IMÓVEL NÃO ENCONTRADO
  */

  if (erro || !imovel) {
    return (
      <main className="imovel-detalhes">
        <div className="imovel-detalhes-container">
          <h1>Imóvel não encontrado</h1>

          <p>
            Não encontramos o imóvel solicitado.
          </p>

          <Link to="/imoveis">
            ← Voltar para imóveis
          </Link>
        </div>
      </main>
    );
  }

  /*
    FUNÇÃO PARA CORRIGIR URL DAS IMAGENS
  */

  function obterUrlImagem(url) {
    if (!url) {
      return "";
    }

    if (url.startsWith("/uploads/")) {
  return `https://castellari-imoveis.onrender.com${url}`;
}

    return url;
  }

  /*
    IMAGENS
  */

  const imagens = Array.isArray(imovel.imagens)
    ? imovel.imagens.map((imagem) =>
        obterUrlImagem(imagem.url)
      )
    : [];

  /*
    FORMATAÇÕES
  */

  const precoFormatado = Number(imovel.preco).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );

  const areaFormatada =
    imovel.area !== null && imovel.area !== undefined
      ? `${imovel.area} m²`
      : null;

  return (
    <main className="imovel-detalhes">
      <div className="imovel-detalhes-container">

        <Link
          to="/imoveis"
          className="voltar-link"
        >
          ← Voltar para imóveis
        </Link>

        {/* CARROSSEL */}

        <section className="detalhe-carrossel">

          {imagens.length > 0 ? (
            <>
              <div className="carrossel-principal">

                <img
                  src={imagens[fotoAtual]}
                  alt={`${imovel.titulo} - foto ${fotoAtual + 1}`}
                  className="carrossel-imagem"
                />

                <div className="carrossel-marca">
                  CASTELLARI IMÓVEIS
                </div>

                {imagens.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="carrossel-seta carrossel-esquerda"
                      onClick={() =>
                        setFotoAtual((foto) =>
                          foto === 0
                            ? imagens.length - 1
                            : foto - 1
                        )
                      }
                      aria-label="Foto anterior"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      className="carrossel-seta carrossel-direita"
                      onClick={() =>
                        setFotoAtual((foto) =>
                          foto === imagens.length - 1
                            ? 0
                            : foto + 1
                        )
                      }
                      aria-label="Próxima foto"
                    >
                      ›
                    </button>

                    <div className="carrossel-contador">
                      {fotoAtual + 1} / {imagens.length}
                    </div>
                  </>
                )}

              </div>

              {/* MINIATURAS */}

              {imagens.length > 1 && (
                <div className="carrossel-miniaturas">

                  {imagens.map((imagem, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`carrossel-miniatura ${
                        fotoAtual === index
                          ? "ativa"
                          : ""
                      }`}
                      onClick={() =>
                        setFotoAtual(index)
                      }
                    >
                      <img
                        src={imagem}
                        alt={`Miniatura ${index + 1}`}
                        loading="lazy"
                      />
                    </button>
                  ))}

                </div>
              )}
            </>
          ) : (
            <div className="detalhe-sem-imagem">
              <span>CASTELLARI IMÓVEIS</span>
              <p>IMAGEM DA PROPRIEDADE</p>
            </div>
          )}

        </section>

        {/* INFORMAÇÕES */}

        <section className="detalhe-informacoes">

          <span className="detalhe-tipo">
            {imovel.tipo}
          </span>

          <h1>
            {imovel.titulo}
          </h1>

          {imovel.localizacao && (
            <p className="detalhe-localizacao">
              {imovel.localizacao}
            </p>
          )}

          {imovel.preco && (
            <p className="detalhe-preco">
              {precoFormatado}
            </p>
          )}

          {/* CARACTERÍSTICAS */}

          <div className="detalhe-caracteristicas">

            {imovel.quartos !== null &&
              imovel.quartos !== undefined && (
                <div className="caracteristica">
                  <strong>
                    {imovel.quartos}
                  </strong>
                  <span>Quartos</span>
                </div>
              )}

            {imovel.suites !== null &&
              imovel.suites !== undefined && (
                <div className="caracteristica">
                  <strong>
                    {imovel.suites}
                  </strong>
                  <span>Suítes</span>
                </div>
              )}

            {imovel.banheiros !== null &&
              imovel.banheiros !== undefined && (
                <div className="caracteristica">
                  <strong>
                    {imovel.banheiros}
                  </strong>
                  <span>Banheiros</span>
                </div>
              )}

            {imovel.vagas !== null &&
              imovel.vagas !== undefined && (
                <div className="caracteristica">
                  <strong>
                    {imovel.vagas}
                  </strong>
                  <span>Vagas</span>
                </div>
              )}

            {areaFormatada && (
              <div className="caracteristica">
                <strong>
                  {areaFormatada}
                </strong>
                <span>Área</span>
              </div>
            )}

          </div>

          {/* DESCRIÇÃO */}

          <section className="detalhe-descricao">

            <h2>
              Sobre o imóvel
            </h2>

            <p>
              {imovel.descricao ||
                "Entre em contato para obter mais informações sobre este imóvel."}
            </p>

          </section>

          {/* VÍDEO */}

          {imovel.video && (
            <section className="detalhe-video">

              <h2>
                Conheça a propriedade
              </h2>

              <video
                controls
                playsInline
                preload="metadata"
                poster={imagens[0]}
              >
                <source
                  src={imovel.video}
                  type="video/mp4"
                />

                Seu navegador não suporta vídeo.
              </video>

            </section>
          )}

          {/* CONTATO */}

          <section className="detalhe-contato">

            <h2>
              Gostou deste imóvel?
            </h2>

            <p>
              Entre em contato com a Castellari
              Imóveis para saber mais informações.
            </p>

            <a
              href="/#contato"
              className="detalhe-contato-button"
            >
              FALAR COM UM CONSULTOR
            </a>

          </section>

        </section>

      </div>
    </main>
  );
}