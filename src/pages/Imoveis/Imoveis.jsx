import { useEffect, useState } from "react";
import "./Imoveis.css";
import { buscarImoveis } from "../../services/api";
import ImovelCard from "../../components/menu/ImovelCard/ImovelCard";

function Imoveis() {
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
    <div className="imoveis-page">

      <header className="imoveis-header">

        <div className="logo">
          <svg
            className="logo-castelo"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g
              fill="none"
              stroke="#c9a45f"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Torre central */}
              <path d="M35 82V28H65V82" />

              {/* Torre esquerda */}
              <path d="M10 82V43H35V82" />

              {/* Torre direita */}
              <path d="M65 43V82H90V43" />

              {/* Ameias torre central */}
              <path d="M35 28V21H42V28H50V21H58V28H65" />

              {/* Ameias torre esquerda */}
              <path d="M10 43V36H17V43H24V36H31V43H35" />

              {/* Ameias torre direita */}
              <path d="M65 82V43H90V82" />

              {/* Porta */}
              <path d="M44 82V67C44 61 48 57 50 57C52 57 56 61 56 67V82" />

              {/* Janela */}
              <path d="M47 45V40C47 37 53 37 53 40V45" />

              {/* Bandeira */}
              <path d="M50 21V9" />
              <path d="M50 9H70L62 15L70 21H50" />

              {/* Base */}
              <path d="M6 82H94" />
            </g>
          </svg>

          <span>CASTELLARI IMÓVEIS</span>
        </div>

        <nav>
          <a href="/">INÍCIO</a>
          <a href="/imoveis">IMÓVEIS</a>
          <a href="#">DIFERENCIAIS</a>
          <a href="#">COMO FUNCIONA</a>
        </nav>

        <button>FALE COM UM CONSULTOR</button>

      </header>

      <main className="imoveis-content">

        <div className="imoveis-intro">

          <span className="eyebrow">
            PORTFÓLIO SELECIONADO
          </span>

          <h1>
            Imóveis que
            <br />
            <em>merecem</em> ser vividos.
          </h1>

          <p>
            Encontre uma seleção criteriosa de propriedades,
            escolhidas pela localização, arquitetura e potencial.
          </p>

        </div>

        <section className="imoveis-grid">

          {carregando && (
            <p>Carregando imóveis...</p>
          )}

          {erro && (
            <p>
              Não foi possível carregar os imóveis.
            </p>
          )}

          {!carregando &&
            !erro &&
            imoveis.map((imovel) => (
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
              />
            ))}

        </section>

      </main>

    </div>
  );
}

export default Imoveis;