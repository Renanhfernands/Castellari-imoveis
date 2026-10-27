import { useEffect, useRef, useState } from "react";
import "./CastellariLanding.css";
import { Link } from "react-router-dom";

// ==========================================
// DIFERENCIAIS
// ==========================================

const DIFERENCIAIS = [
  {
    title: "Curadoria criteriosa",
    text: "Cada imóvel é analisado com atenção aos detalhes, localização, arquitetura e potencial antes de ser apresentado.",
    icon: (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="10" />
        <line x1="15" y1="8" x2="15" y2="15" />
        <line x1="15" y1="15" x2="20" y2="18" />
      </svg>
    ),
  },
  {
    title: "Discrição e privacidade",
    text: "Cada relacionamento é conduzido com respeito, discrição e atenção à privacidade de nossos clientes.",
    icon: (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <rect x="8" y="12" width="14" height="14" />
        <path d="M11 12V8a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: "Atendimento próximo",
    text: "Entendemos o momento e as necessidades de cada cliente para tornar a busca por um imóvel mais precisa.",
    icon: (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="10" r="4" />
        <path d="M7 25c1-5 4-8 8-8s7 3 8 8" />
      </svg>
    ),
  },
  {
    title: "Acompanhamento completo",
    text: "Estamos presentes em cada etapa da jornada, do primeiro contato à conclusão da negociação.",
    icon: (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <path d="M6 15h6l3-8 3 16 3-8h3" />
      </svg>
    ),
  },
];

// ==========================================
// PROCESSO
// ==========================================

const PROCESSO = [
  {
    idx: "01",
    title: "Curadoria",
    text: "Entendemos exatamente o que você procura — localização, metragem, uso e momento — antes de apresentar qualquer opção.",
  },
  {
    idx: "02",
    title: "Seleção",
    text: "Apresentamos propriedades que realmente fazem sentido para o seu perfil, evitando uma busca excessiva e sem direção.",
  },
  {
    idx: "03",
    title: "Negociação",
    text: "Conduzimos a negociação de forma transparente e cuidadosa, buscando as melhores condições para cada operação.",
  },
  {
    idx: "04",
    title: "Conclusão",
    text: "Acompanhamos as etapas finais da negociação para que a experiência seja tranquila até a conclusão.",
  },
];

// ==========================================
// DEPOIMENTOS
// ==========================================

const DEPOIMENTOS = [
  {
    text: "Conduziram a venda com uma discrição que eu não esperava encontrar no mercado imobiliário.",
    initials: "R.M.",
    role: "Empresário",
  },
  {
    text: "O atendimento foi cuidadoso do início ao fim. Sentimos que realmente entenderam o que procurávamos.",
    initials: "C.A.",
    role: "Cliente Castellari",
  },
  {
    text: "Uma experiência muito mais próxima e tranquila do que estamos acostumados no mercado imobiliário.",
    initials: "F.T.",
    role: "Cliente Castellari",
  },
];

// ==========================================
// HOOK DE REVEAL
// ==========================================

/**
 * Hook simples:
 * adiciona a classe "in" a qualquer elemento .reveal
 * quando ele entra na tela.
 */
function useReveal() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const els = rootRef.current.querySelectorAll(".reveal");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return rootRef;
}

// ==========================================
// WHATSAPP
// ==========================================

// Número do WhatsApp da imobiliária,
// no formato internacional, só dígitos.
const WHATSAPP_NUMBER = "5513988674024";

// ==========================================
// COMPONENTE
// ==========================================

export default function CastellariLanding() {
  const rootRef = useReveal();

  const [scrolled, setScrolled] = useState(false);

  const [formNote, setFormNote] = useState(
    "Você será redirecionado para o WhatsApp."
  );

  // ==========================================
  // SCROLL
  // ==========================================

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ==========================================
  // FORMULÁRIO
  // ==========================================

  function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(e.target);

    const nome = data.get("nome");
    const telefone = data.get("telefone");
    const email = data.get("email");
    const msg = data.get("msg");

    const texto =
      `Olá! Vim pelo site da Castellari Imóveis, estou interessado(a) e gostaria de mais informações.\n\n` +
      `Nome: ${nome}\n` +
      `Telefone: ${telefone}\n` +
      `E-mail: ${email}` +
      (msg ? `\nO que procuro: ${msg}` : "");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      texto
    )}`;

    setFormNote("Redirecionando para o WhatsApp...");

    window.open(url, "_blank");

    e.target.reset();
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div ref={rootRef} className="castellari">

      {/* ================= NAV ================= */}

      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="wrap nav-inner">

          <a href="#" className="brand">

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

            CASTELLARI IMÓVEIS
          </a>

          <nav className="nav-links">
            <a href="#imoveis">Imóveis</a>
            <a href="#diferenciais">Diferenciais</a>
            <a href="#processo">Como funciona</a>

            <a href="#contato" className="nav-cta">
              Fale com um consultor
            </a>
          </nav>

          <button
            className="nav-toggle"
            aria-label="Menu"
            type="button"
          >
            ☰
          </button>

        </div>
      </header>

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="wrap hero-grid">

          <div>

            <div className="hero-eyebrow">
              <span className="rule"></span>
              CURADORIA IMOBILIÁRIA DESDE 2026
            </div>

            <h1>
              Cada endereço,
              <br />
              <em>lavrado</em> com precisão.
            </h1>

            <p className="lead">
              A Castellari seleciona um portfólio restrito de imóveis
              de alto padrão. Cada propriedade é avaliada, medida e
              apresentada com o mesmo rigor de um projeto arquitetônico.
            </p>

            <div className="hero-actions">

              <Link
                to="/imoveis"
                className="btn btn-primary"
              >
                Ver imóveis selecionados
              </Link>

              <a
                href="#contato"
                className="btn btn-ghost"
              >
                Falar com um consultor
              </a>

            </div>

          </div>

          <div className="hero-art">

            <svg viewBox="0 0 560 560">

              {/* ================= PREENCHIMENTO DA FACHADA ================= */}

              <path
                className="facade-fill"
                d="
                  M70 475
                  V230
                  L88 210
                  L106 230
                  L124 210
                  L142 230

                  V195
                  L160 175
                  L178 195
                  L196 175
                  L214 195

                  V215
                  H235
                  V165
                  L280 115
                  L325 165
                  V215
                  H346

                  V195
                  L364 175
                  L382 195
                  L400 175
                  L418 195

                  V230
                  L436 210
                  L454 230
                  L472 210
                  L490 230

                  V475
                  Z
                "
              />

              <g className="facade-line draw">

                {/* ================= TORRE ESQUERDA ================= */}

                <path
                  d="
                    M70 475
                    V230
                    L88 210
                    L106 230
                    L124 210
                    L142 230
                    V475
                  "
                  fill="none"
                />

                <line x1="88" y1="210" x2="88" y2="185" />
                <line x1="106" y1="230" x2="106" y2="200" />
                <line x1="124" y1="210" x2="124" y2="185" />

                {/* Janela */}

                <path
                  d="
                    M88 305
                    V275
                    C88 255 124 255 124 275
                    V305
                  "
                  fill="none"
                />

                <line x1="106" y1="255" x2="106" y2="305" />

                {/* ================= TORRE INTERMEDIÁRIA ESQUERDA ================= */}

                <path
                  d="
                    M142 475
                    V195
                    L160 175
                    L178 195
                    L196 175
                    L214 195
                    V475
                  "
                  fill="none"
                />

                <path
                  d="
                    M158 285
                    V260
                    C158 242 198 242 198 260
                    V285
                  "
                  fill="none"
                />

                <line x1="178" y1="242" x2="178" y2="285" />

                {/* ================= TORRE CENTRAL ================= */}

                <path
                  d="
                    M214 475
                    V215
                    H235
                    V165
                    L280 115
                    L325 165
                    V215
                    H346
                    V475
                  "
                  fill="none"
                />

                {/* Telhado central */}

                <line x1="235" y1="165" x2="280" y2="135" />
                <line x1="280" y1="135" x2="325" y2="165" />

                {/* Bandeira */}

                <line
                  x1="280"
                  y1="115"
                  x2="280"
                  y2="78"
                />

                <path
                  d="
                    M280 78
                    L305 86
                    L280 96
                    Z
                  "
                  fill="none"
                />

                {/* Janela central superior */}

                <path
                  d="
                    M263 205
                    V180
                    C263 165 297 165 297 180
                    V205
                  "
                  fill="none"
                />

                <line
                  x1="280"
                  y1="165"
                  x2="280"
                  y2="205"
                />

                {/* ================= TORRE INTERMEDIÁRIA DIREITA ================= */}

                <path
                  d="
                    M346 475
                    V195
                    L364 175
                    L382 195
                    L400 175
                    L418 195
                    V475
                  "
                  fill="none"
                />

                <path
                  d="
                    M362 285
                    V260
                    C362 242 402 242 402 260
                    V285
                  "
                  fill="none"
                />

                <line x1="382" y1="242" x2="382" y2="285" />

                {/* ================= TORRE DIREITA ================= */}

                <path
                  d="
                    M418 475
                    V230
                    L436 210
                    L454 230
                    L472 210
                    L490 230
                    V475
                  "
                  fill="none"
                />

                <path
                  d="
                    M436 305
                    V275
                    C436 255 472 255 472 275
                    V305
                  "
                  fill="none"
                />

                <line x1="454" y1="255" x2="454" y2="305" />

                {/* ================= CORPO PRINCIPAL ================= */}

                <line
                  x1="142"
                  y1="330"
                  x2="418"
                  y2="330"
                />

                <line
                  x1="142"
                  y1="395"
                  x2="418"
                  y2="395"
                />

                {/* Janelas primeiro nível */}

                <path
                  d="
                    M175 325
                    V295
                    C175 275 205 275 205 295
                    V325
                  "
                  fill="none"
                />

                <path
                  d="
                    M355 325
                    V295
                    C355 275 385 275 385 295
                    V325
                  "
                  fill="none"
                />

                {/* Janelas segundo nível */}

                <path
                  d="
                    M225 375
                    V350
                    C225 335 245 335 245 350
                    V375
                  "
                  fill="none"
                />

                <path
                  d="
                    M315 375
                    V350
                    C315 335 335 335 335 350
                    V375
                  "
                  fill="none"
                />

                {/* ================= ENTRADA ================= */}

                <path
                  d="
                    M245 475
                    V405
                    C245 365 315 365 315 405
                    V475
                  "
                  fill="none"
                />

                {/* Porta dupla */}

                <line
                  x1="280"
                  y1="380"
                  x2="280"
                  y2="475"
                />

                {/* Detalhes da entrada */}

                <line
                  x1="235"
                  y1="405"
                  x2="245"
                  y2="405"
                />

                <line
                  x1="315"
                  y1="405"
                  x2="325"
                  y2="405"
                />

                {/* Pequenas colunas */}

                <line
                  x1="235"
                  y1="405"
                  x2="235"
                  y2="475"
                />

                <line
                  x1="325"
                  y1="405"
                  x2="325"
                  y2="475"
                />

                {/* Base arquitetônica */}

                <line
                  x1="70"
                  y1="475"
                  x2="490"
                  y2="475"
                />

              </g>

              {/* ================= COTAS ================= */}

              <g className="fade-in-svg">

                {/* Medida horizontal */}

                <line
                  className="facade-line"
                  x1="70"
                  y1="505"
                  x2="490"
                  y2="505"
                />

                <line
                  className="facade-line"
                  x1="70"
                  y1="500"
                  x2="70"
                  y2="510"
                />

                <line
                  className="facade-line"
                  x1="490"
                  y1="500"
                  x2="490"
                  y2="510"
                />

                <text
                  className="dim-text"
                  x="255"
                  y="523"
                >
                  18,60 m
                </text>

                {/* Medida vertical */}

                <line
                  className="facade-line"
                  x1="520"
                  y1="78"
                  x2="520"
                  y2="475"
                />

                <line
                  className="facade-line"
                  x1="515"
                  y1="78"
                  x2="525"
                  y2="78"
                />

                <line
                  className="facade-line"
                  x1="515"
                  y1="475"
                  x2="525"
                  y2="475"
                />

                <text
                  className="dim-text"
                  x="535"
                  y="300"
                  transform="rotate(90 535 300)"
                >
                  31,20 m
                </text>

              </g>

            </svg>

          </div>

        </div>

      </section>

      {/* ================= STATS ================= */}

      <div className="stats">

        <div className="wrap stats-inner">

          <div className="stat">
            <div className="num mono">1</div>
            <div className="cap">Anos de atuação</div>
          </div>

          <div className="stat">
            <div className="num mono">30</div>
            <div className="cap">Imóveis negociados</div>
          </div>

          
          <div className="stat">
            <div className="num mono">98%</div>
            <div className="cap">Clientes por indicação</div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* ================= CURADORIA CASTELLARI ================== */}
      {/* ========================================================= */}

      <section className="section castellari-curadoria" id="imoveis">

        <div className="wrap">

          <div className="section-head reveal">

            <div>

              <span className="eyebrow">
                Curadoria Castellari
              </span>

              <h2>
                Mais do que encontrar um imóvel.
                <br />
                <em>Encontrar o lugar certo.</em>
              </h2>

            </div>

            <p>
              Acreditamos que uma propriedade não deve ser escolhida
              apenas por seus números. Localização, arquitetura,
              atmosfera e propósito também fazem parte de uma boa
              decisão.
            </p>

          </div>

          {/* ================= TEXTO PRINCIPAL ================= */}

          <div className="curadoria-intro reveal">

            <div className="curadoria-intro-number mono">
              01
            </div>

            <div className="curadoria-intro-content">

              <span className="eyebrow-inline">
                O nosso olhar
              </span>

              <h3>
                Escolhas mais precisas começam
                <br />
                com uma atenção maior aos detalhes.
              </h3>

              <p>
                Na Castellari, preferimos qualidade à quantidade.
                Nosso trabalho começa entendendo pessoas, momentos
                e objetivos antes de apresentar propriedades.
              </p>

              <p>
                É essa combinação entre atenção, conhecimento e
                proximidade que transforma uma simples busca em uma
                experiência imobiliária mais segura e sofisticada.
              </p>

              <a
                href="#contato"
                className="property-cta"
              >
                Falar com um consultor →
              </a>

            </div>

          </div>

          {/* ================= PILARES ================= */}

          <div className="curadoria-pillars">

            <article className="curadoria-pillar reveal">

              <span className="pillar-number mono">
                01
              </span>

              <div className="pillar-line"></div>

              <span className="eyebrow">
                Seleção
              </span>

              <h3>
                Curadoria
              </h3>

              <p>
                Selecionamos propriedades considerando não apenas
                metragem e localização, mas também arquitetura,
                contexto e potencial.
              </p>

            </article>

            <article className="curadoria-pillar reveal">

              <span className="pillar-number mono">
                02
              </span>

              <div className="pillar-line"></div>

              <span className="eyebrow">
                Relacionamento
              </span>

              <h3>
                Discrição
              </h3>

              <p>
                Cada atendimento é conduzido com respeito,
                confidencialidade e atenção ao momento de cada
                cliente.
              </p>

            </article>

            <article className="curadoria-pillar reveal">

              <span className="pillar-number mono">
                03
              </span>

              <div className="pillar-line"></div>

              <span className="eyebrow">
                Experiência
              </span>

              <h3>
                Proximidade
              </h3>

              <p>
                Mais do que apresentar imóveis, acompanhamos
                decisões importantes com clareza, cuidado e
                presença.
              </p>

            </article>

          </div>

          {/* ================= FRASE FINAL ================= */}

          <div className="curadoria-quote reveal">

            <span className="quote-mark">
              “
            </span>

            <p>
              O endereço certo não é apenas aquele que atende
              às suas necessidades. É aquele que faz sentido
              para a vida que você deseja construir.
            </p>

            <span className="quote-signature">
              CASTELLARI IMÓVEIS
            </span>

          </div>

        </div>

      </section>

      {/* ================= DIFERENCIAIS ================= */}

      <section
        className="section diff-section"
        id="diferenciais"
      >

        <div className="wrap">

          <div className="section-head reveal">

            <div>

              <span className="eyebrow">
                Por que a Castellari
              </span>

              <h2>
                O rigor de quem projeta,
                aplicado a quem negocia.
              </h2>

            </div>

            <p>
              Não vendemos imóveis em série. Conduzimos cada
              negociação como um projeto único.
            </p>

          </div>

        </div>

        <div className="diff-grid">

          {DIFERENCIAIS.map((d) => (

            <div
              className="diff-item reveal"
              key={d.title}
            >

              <div className="icon">
                {d.icon}
              </div>

              <h3>
                {d.title}
              </h3>

              <p>
                {d.text}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= PROCESSO ================= */}

      <section
        className="section"
        id="processo"
      >

        <div className="wrap">

          <div className="section-head reveal">

            <div>

              <span className="eyebrow">
                Como funciona
              </span>

              <h2>
                Quatro etapas, do primeiro contato
                às chaves.
              </h2>

            </div>

            <p>
              Um processo linear, conduzido de ponta a ponta
              com atenção aos detalhes.
            </p>

          </div>

          <div className="process-list">

            {PROCESSO.map((step) => (

              <div
                className="process-item reveal"
                key={step.idx}
              >

                <div className="idx">
                  {step.idx}
                </div>

                <div>

                  <h3>
                    {step.title}
                  </h3>

                  <p>
                    {step.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= DEPOIMENTOS ================= */}

      <section className="section testi-section">

        <div className="wrap">

          <div className="section-head reveal">

            <div>

              <span className="eyebrow">
                Quem já negociou com a gente
              </span>

              <h2>
                Relações que continuam
                depois da escritura.
              </h2>

            </div>

          </div>

          <div className="testi-grid">

            {DEPOIMENTOS.map((t) => (

              <div
                className="testi-card reveal"
                key={t.initials}
              >

                <p>
                  "{t.text}"
                </p>

                <div className="testi-who">

                  <div className="testi-avatar mono">
                    {t.initials}
                  </div>

                  <div>

                    <div className="name">
                      {t.initials}
                    </div>

                    <div className="role">
                      {t.role}
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* ================= CONTATO ================= */}

      <section
        className="section contact-section"
        id="contato"
      >

        <div className="wrap contact-grid">

          <div className="contact-info reveal">

            <span className="eyebrow-inline">
              Fale com a Castellari
            </span>

            <h2>
              Vamos entender
              <br />
              o que você procura.
            </h2>

            <p>
              Conte-nos um pouco sobre o que você procura.
              Nossa equipe poderá entender melhor o seu momento
              e orientar os próximos passos.
            </p>

            <div className="contact-detail">

              <div>
                <span>Telefone</span>
                +55 11 91222-2196
              </div>

              <div>
                <span>E-mail</span>
                atendimento@castellariimoveis.com
              </div>

             

            </div>

          </div>

          <form
            className="reveal"
            onSubmit={handleSubmit}
          >

            <div className="form-row">

              <div className="field">

                <label htmlFor="nome">
                  Nome
                </label>

                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                />

              </div>

              <div className="field">

                <label htmlFor="telefone">
                  Telefone
                </label>

                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                />

              </div>

            </div>

            <div className="field">

              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
              />

            </div>

            <div className="field">

              <label htmlFor="msg">
                O que você procura
              </label>

              <textarea
                id="msg"
                name="msg"
                placeholder="Região, metragem, prazo..."
              ></textarea>

            </div>

            <button
              type="submit"
              className="form-submit"
            >
              Enviar mensagem
            </button>

            <div className="form-note">
              {formNote}
            </div>

          </form>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer>

        <div className="wrap">

          <div className="footer-top">

            <div className="brand footer-brand">

              <span className="mark"></span>

              CASTELLARI IMÓVEIS

            </div>

            <div className="footer-links">

              <div className="footer-col">

                <h4>
                  Navegação
                </h4>

                <a href="#imoveis">
                  Imóveis
                </a>

                <a href="#diferenciais">
                  Diferenciais
                </a>

                <a href="#processo">
                  Como funciona
                </a>

              </div>

              <div className="footer-col">

                <h4>
                  Contato
                </h4>

                <div>
                  +55 11 91222-2196
                </div>

                <div>
                  atendimento@castellariimoveis.com.br
                </div>

              </div>

              <div className="footer-col">

                <h4>
                  Redes Socias 
                </h4>

                <a
                  href="https://www.instagram.com/castellari_imoveis_?igsh=MXRyemgwbjByczRtZw=="
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>

            

              </div>

            </div>

          </div>

          <div className="footer-bottom">

            <div>
              © 2026 Castellari Imóveis. CRECI 000000-J.
            </div>

            

          </div>

        </div>

      </footer>

    </div>
  );
}