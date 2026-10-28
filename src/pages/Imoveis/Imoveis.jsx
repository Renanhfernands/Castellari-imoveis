import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Imoveis.css";
import { buscarImoveis } from "../../services/api";
import ImovelCard from "../../components/menu/ImovelCard/ImovelCard";

function Imoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

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

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <div className="imoveis-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="imoveis-header">

        {/* LOGO */}

        <Link
          to="/"
          className="logo"
          onClick={fecharMenu}
        >
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
              <path d="M65 43V36H72V43H79V36H86V43H90" />

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
        </Link>


        {/* =================================================
            BOTÃO MENU MOBILE
        ================================================= */}

        <button
          type="button"
          className={`mobile-menu-button ${
            menuAberto ? "active" : ""
          }`}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={
            menuAberto
              ? "Fechar menu"
              : "Abrir menu"
          }
          aria-expanded={menuAberto}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>


        {/* =================================================
            NAVEGAÇÃO
        ================================================= */}

        <nav
          className={menuAberto ? "menu-aberto" : ""}
        >

          <Link
            to="/"
            onClick={fecharMenu}
          >
            INÍCIO
          </Link>

          <Link
            to="/imoveis"
            onClick={fecharMenu}
          >
            IMÓVEIS
          </Link>

          <Link
            to="/#diferenciais"
            onClick={fecharMenu}
          >
            DIFERENCIAIS
          </Link>

          <Link
            to="/#processo"
            onClick={fecharMenu}
          >
            COMO FUNCIONA
          </Link>


          {/* BOTÃO CONSULTOR - MOBILE */}

          <Link
            to="/#contato"
            className="mobile-contact-link"
            onClick={fecharMenu}
          >
            FALE COM UM CONSULTOR
          </Link>

        </nav>


        {/* =================================================
            BOTÃO CONSULTOR - DESKTOP
        ================================================= */}

        <Link
          to="/#contato"
          className="imoveis-contact-button"
        >
          FALE COM UM CONSULTOR
        </Link>

      </header>


      {/* =====================================================
          CONTEÚDO PRINCIPAL
      ===================================================== */}

      <main className="imoveis-content">

        <section className="imoveis-intro">

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

        </section>


        {/* =================================================
            GRID DE IMÓVEIS
        ================================================= */}

        <section className="imoveis-grid">

          {carregando && (
            <p className="imoveis-status">
              Carregando imóveis...
            </p>
          )}

          {erro && (
            <p className="imoveis-status">
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


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="imoveis-footer">

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >

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
                <path d="M35 82V28H65V82" />
                <path d="M10 82V43H35V82" />
                <path d="M65 43V82H90V43" />

                <path d="M35 28V21H42V28H50V21H58V28H65" />
                <path d="M10 43V36H17V43H24V36H31V43H35" />
                <path d="M65 43V36H72V43H79V36H86V43H90" />

                <path d="M44 82V67C44 61 48 57 50 57C52 57 56 61 56 67V82" />

                <path d="M47 45V40C47 37 53 37 53 40V45" />

                <path d="M50 21V9" />
                <path d="M50 9H70L62 15L70 21H50" />

                <path d="M6 82H94" />
              </g>
            </svg>

            <span>CASTELLARI IMÓVEIS</span>

          </Link>

          <p>
            Imóveis selecionados para quem valoriza
            localização, arquitetura e potencial.
          </p>

        </div>


        <div className="footer-links">

          <div>

            <span className="footer-title">
              NAVEGAÇÃO
            </span>

            <Link to="/">
              Início
            </Link>

            <Link to="/imoveis">
              Imóveis
            </Link>

            <Link to="/#diferenciais">
              Diferenciais
            </Link>

            <Link to="/#processo">
              Como funciona
            </Link>

          </div>


          <div>

            <span className="footer-title">
              CONTATO
            </span>

            <Link to="/#contato">
              Fale com um consultor
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} Castellari Imóveis
          </span>

          <span>
            Todos os direitos reservados.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Imoveis;