import { useEffect, useRef, useState } from "react";
import "./CastellariLanding.css";
import { Link } from "react-router-dom";

const PROPERTIES = [
  {
    tag: "Cobertura",
    name: "Cobertura Jardins",
    loc: "Jardim Paulista, São Paulo",
    specs: [
      { v: "420 m²", l: "Área" },
      { v: "4", l: "Suítes" },
      { v: "5", l: "Vagas" },
    ],
    price: "R$ 18.500.000",
    facade: (
      <svg viewBox="0 0 260 150">
        <g className="facade-line" strokeWidth="1">
          <rect x="20" y="20" width="220" height="110" />
          <line x1="20" y1="55" x2="240" y2="55" />
          <line x1="20" y1="90" x2="240" y2="90" />
          <line x1="86" y1="20" x2="86" y2="130" />
          <line x1="152" y1="20" x2="152" y2="130" />
          <line x1="218" y1="20" x2="218" y2="130" />
        </g>
      </svg>
    ),
  },
  {
    tag: "Casa",
    name: "Casa Alto de Pinheiros",
    loc: "Alto de Pinheiros, São Paulo",
    specs: [
      { v: "680 m²", l: "Construídos" },
      { v: "5", l: "Suítes" },
      { v: "6", l: "Vagas" },
    ],
    price: "R$ 24.900.000",
    facade: (
      <svg viewBox="0 0 260 150">
        <g className="facade-line" strokeWidth="1">
          <polygon points="20,60 130,20 240,60 240,130 20,130" />
          <line x1="20" y1="90" x2="240" y2="90" />
          <line x1="80" y1="60" x2="80" y2="130" />
          <line x1="180" y1="60" x2="180" y2="130" />
          <rect x="115" y="95" width="30" height="35" />
        </g>
      </svg>
    ),
  },
  {
    tag: "Apartamento",
    name: "Vila Nova Conceição",
    loc: "Vila Nova Conceição, São Paulo",
    specs: [
      { v: "310 m²", l: "Área" },
      { v: "3", l: "Suítes" },
      { v: "3", l: "Vagas" },
    ],
    price: "R$ 9.800.000",
    facade: (
      <svg viewBox="0 0 260 150">
        <g className="facade-line" strokeWidth="1">
          <rect x="40" y="15" width="180" height="120" />
          <line x1="40" y1="45" x2="220" y2="45" />
          <line x1="40" y1="75" x2="220" y2="75" />
          <line x1="40" y1="105" x2="220" y2="105" />
          <line x1="130" y1="15" x2="130" y2="135" />
        </g>
      </svg>
    ),
  },
];

const DIFERENCIAIS = [
  {
    title: "Curadoria criteriosa",
    text: "Cada imóvel passa por avaliação técnica e documental antes de entrar no portfólio.",
    icon: (
      <svg viewBox="0 0 30 30">
        <circle cx="15" cy="15" r="10" />
        <line x1="15" y1="8" x2="15" y2="15" />
        <line x1="15" y1="15" x2="20" y2="18" />
      </svg>
    ),
  },
  {
    title: "Discrição e privacidade",
    text: "Negociações conduzidas com sigilo, sem exposição pública do imóvel ou das partes.",
    icon: (
      <svg viewBox="0 0 30 30">
        <rect x="8" y="12" width="14" height="14" />
        <path d="M11 12V8a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: "Due diligence completa",
    text: "Análise jurídica e documental integral antes de qualquer proposta ser formalizada.",
    icon: (
      <svg viewBox="0 0 30 30">
        <path d="M15 5l9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V9z" />
      </svg>
    ),
  },
  {
    title: "Acompanhamento pós-venda",
    text: "A nossa equipe permanece à disposição após a escritura, para o que for necessário.",
    icon: (
      <svg viewBox="0 0 30 30">
        <path d="M6 15h6l3-8 3 16 3-8h3" />
      </svg>
    ),
  },
];

const PROCESSO = [
  { idx: "01", title: "Curadoria", text: "Entendemos exatamente o que você procura — localização, metragem, uso e prazo — antes de sugerir qualquer opção." },
  { idx: "02", title: "Seleção", text: "Apresentamos até três imóveis compatíveis com o seu critério, com dossiê técnico completo de cada um." },
  { idx: "03", title: "Negociação", text: "Conduzimos toda a negociação de valores e condições com discrição, representando seus interesses." },
  { idx: "04", title: "Escritura", text: "Cuidamos da documentação, due diligence e formalização até a entrega das chaves." },
];

const DEPOIMENTOS = [
  { text: "Conduziram a venda com uma discrição que eu não esperava encontrar no mercado imobiliário.", initials: "R.M.", role: "Empresário" },
  { text: "O dossiê técnico do imóvel foi mais completo do que qualquer laudo que já recebi antes.", initials: "C.A.", role: "Investidora" },
  { text: "Depois da escritura, ainda nos ajudaram a resolver questões de documentação. Isso é raro.", initials: "F.T.", role: "Diretor de família" },
];

/** Hook simples: adiciona a classe "in" a qualquer elemento .reveal quando ele entra na tela */
function useReveal() {
  const rootRef = useRef(null);
  useEffect(() => {
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
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return rootRef;
}

// Número do WhatsApp da imobiliária, no formato internacional, só dígitos
// (55 = Brasil, DDD + número). Troque pelo número real antes de publicar.
const WHATSAPP_NUMBER = "5513988674024";

export default function CastellariLanding() {
  const rootRef = useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [formNote, setFormNote] = useState("Você será redirecionado para o WhatsApp.");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    setFormNote("Redirecionando para o WhatsApp...");
    window.open(url, "_blank");
    e.target.reset();
  }

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
      <path d="M65 82V43H90V82" />

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
            <a href="#contato" className="nav-cta">Fale com um consultor</a>
          </nav>
          <button className="nav-toggle" aria-label="Menu">☰</button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="hero-eyebrow"><span className="rule"></span>CURADORIA IMOBILIÁRIA DESDE 2026</div>
            <h1>Cada endereço,<br /><em>lavrado</em> com precisão.</h1>
            <p className="lead">A Castellari seleciona um portfólio restrito de imóveis de alto padrão. Cada propriedade é avaliada, medida e apresentada com o mesmo rigor de um projeto arquitetônico.</p>
            <div className="hero-actions">
              <Link 
                to="/imoveis"
                className="btn btn-primary"
                >
                  Ver imóveis selecionados
                  </Link>
             
              <a href="#contato" className="btn btn-ghost">Falar com um consultor</a>
            </div>
          </div>
          <div className="hero-art">
       <svg viewBox="0 0 560 560">

  {/* preenchimento da fachada */}
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

    {/* detalhes superiores */}
    <line x1="88" y1="210" x2="88" y2="185" />
    <line x1="106" y1="230" x2="106" y2="200" />
    <line x1="124" y1="210" x2="124" y2="185" />

    {/* janela */}
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

    {/* janela */}
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

    {/* telhado central detalhado */}
    <line x1="235" y1="165" x2="280" y2="135" />
    <line x1="280" y1="135" x2="325" y2="165" />

    {/* bandeira */}
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

    {/* janela central superior */}
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

    {/* janela */}
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

    {/* janela */}
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

    {/* linha estrutural superior */}
    <line x1="142" y1="330" x2="418" y2="330" />

    {/* linha estrutural inferior */}
    <line x1="142" y1="395" x2="418" y2="395" />

    {/* janelas do primeiro nível */}
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

    {/* janelas do segundo nível */}
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

    {/* porta dupla */}
    <line
      x1="280"
      y1="380"
      x2="280"
      y2="475"
    />

    {/* detalhes da entrada */}
    <line x1="235" y1="405" x2="245" y2="405" />
    <line x1="315" y1="405" x2="325" y2="405" />

    {/* pequenas colunas */}
    <line x1="235" y1="405" x2="235" y2="475" />
    <line x1="325" y1="405" x2="325" y2="475" />

    {/* base arquitetônica */}
    <line x1="70" y1="475" x2="490" y2="475" />

  </g>

  {/* ================= COTAS ================= */}

  <g className="fade-in-svg">

    {/* medida horizontal */}
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

    {/* medida vertical */}
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

      <div className="stats">
        <div className="wrap stats-inner">
          <div className="stat"><div className="num mono">1</div><div className="cap">Anos de atuação</div></div>
          <div className="stat"><div className="num mono">3</div><div className="cap">Imóveis negociados</div></div>
          <div className="stat"><div className="num mono">R$ 2,8 bi</div><div className="cap">Em transações</div></div>
          <div className="stat"><div className="num mono">98%</div><div className="cap">Clientes por indicação</div></div>
        </div>
      </div>

      {/* ================= IMÓVEIS ================= */}
      <section className="section" id="imoveis">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Portfólio ativo</span>
              <h2>Uma seleção enxuta, escolhida a dedo.</h2>
            </div>
            <p>Trabalhamos com um número limitado de imóveis por vez — o suficiente para conhecer cada um deles em detalhe.</p>
          </div>

          <div className="properties-grid">
            {PROPERTIES.map((p) => (
              <div className="property-card reveal" key={p.name}>
                <div className="property-visual">
                  <span className="property-tag">{p.tag}</span>
                  {p.facade}
                </div>
                <div className="property-body">
                  <h3>{p.name}</h3>
                  <div className="property-loc">{p.loc}</div>
                  <div className="property-specs">
                    {p.specs.map((s) => (
                      <div className="spec" key={s.l}>
                        <span className="v mono">{s.v}</span>
                        <span className="l">{s.l}</span>
                      </div>
                    ))}
                  </div>
                  <div className="property-price">{p.price}</div>
                  <a href="#contato" className="property-cta">Solicitar dossiê →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DIFERENCIAIS ================= */}
      <section className="section diff-section" id="diferenciais">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Por que a Castellari</span>
              <h2>O rigor de quem projeta, aplicado a quem negocia.</h2>
            </div>
            <p>Não vendemos imóveis em série. Conduzimos cada negociação como um projeto único.</p>
          </div>
        </div>
        <div className="diff-grid">
          {DIFERENCIAIS.map((d) => (
            <div className="diff-item reveal" key={d.title}>
              <div className="icon">{d.icon}</div>
              <h3>{d.title}</h3>
              <p>{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROCESSO ================= */}
      <section className="section" id="processo">
        <div className="wrap">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Como funciona</span>
              <h2>Quatro etapas, do primeiro contato às chaves.</h2>
            </div>
            <p>Um processo linear, conduzido de ponta a ponta pelo mesmo consultor.</p>
          </div>
          <div className="process-list">
            {PROCESSO.map((step) => (
              <div className="process-item reveal" key={step.idx}>
                <div className="idx">{step.idx}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
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
              <span className="eyebrow">Quem já negociou com a gente</span>
              <h2>Relações que continuam depois da escritura.</h2>
            </div>
          </div>
          <div className="testi-grid">
            {DEPOIMENTOS.map((t) => (
              <div className="testi-card reveal" key={t.initials}>
                <p>"{t.text}"</p>
                <div className="testi-who">
                  <div className="testi-avatar mono">{t.initials}</div>
                  <div>
                    <div className="name">{t.initials}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTATO ================= */}
      <section className="section contact-section" id="contato">
        <div className="wrap contact-grid">
          <div className="contact-info reveal">
            <span className="eyebrow-inline">Fale com a Castellari</span>
            <h2>Vamos entender o que você procura.</h2>
            <p>Preencha os campos ao lado e um de nossos consultores retorna o contato em até um dia útil.</p>
            <div className="contact-detail">
              <div><span>Telefone</span>+55 11 91222-2196</div>
              <div><span>E-mail</span>atendimento@castellariimoveis.com</div>
              <div><span>Endereço</span>Av. Domingos Antônio di Sandro, São Paulo — SP</div>
            </div>
          </div>
          <form className="reveal" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="field"><label htmlFor="nome">Nome</label><input id="nome" name="nome" type="text" required /></div>
              <div className="field"><label htmlFor="telefone">Telefone</label><input id="telefone" name="telefone" type="tel" required /></div>
            </div>
            <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required /></div>
            <div className="field"><label htmlFor="msg">O que você procura</label><textarea id="msg" name="msg" placeholder="Região, metragem, prazo..."></textarea></div>
            <button type="submit" className="form-submit">Enviar mensagem</button>
            <div className="form-note">{formNote}</div>
          </form>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="brand footer-brand"><span className="mark"></span>CASTELLARI IMÓVEIS</div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Navegação</h4>
                <a href="#imoveis">Imóveis</a>
                <a href="#diferenciais">Diferenciais</a>
                <a href="#processo">Como funciona</a>
              </div>
              <div className="footer-col">
                <h4>Contato</h4>
                <div>+55 11 91222-2196</div>
                <div>atendimento@castellariimoveis.com.br</div>
              </div>
              <div className="footer-col">
                <h4>Redes</h4>
                <a href="https://www.instagram.com/castellari_imoveis_?igsh=MXRyemgwbjByczRtZw==">Instagram</a>
                <a href="#">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 Castellari Imóveis. CRECI 000000-J.</div>
            <div>Av. Domingos Antônio di Sandro, São Paulo — SP</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
