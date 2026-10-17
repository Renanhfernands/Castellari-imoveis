import "./Imoveis.css";
import imoveis from "../../Data/Imoveiss.js";
import ImovelCard from "../../components/menu/ImovelCard/ImovelCard";

function Imoveis() {
  return (
    <div className="imoveis-page">
      <header className="imoveis-header">
        <div className="logo">
          <span>◇</span> CASTELLARI IMÓVEIS
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
          {imoveis.map((imovel) => (
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