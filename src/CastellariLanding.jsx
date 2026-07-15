import { useEffect, useRef, useState } from "react";
import "./CastellariLanding.css";

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
    text: "Nossa equipe permanece à disposição após a escritura, para o que for necessário.",
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
            <span className="mark"></span>CASTELLARI IMÓVEIS
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
              <a href="#imoveis" className="btn btn-primary">Ver imóveis selecionados</a>
              <a href="#contato" className="btn btn-ghost">Falar com um consultor</a>
            </div>
          </div>
          <div className="hero-art">
            <svg viewBox="0 0 480 560">
              <rect className="facade-fill" x="90" y="60" width="300" height="420" />
              <rect className="facade-line draw" x="90" y="60" width="300" height="420" />
              <g className="facade-line draw">
                <line x1="90" y1="130" x2="390" y2="130" />
                <line x1="90" y1="200" x2="390" y2="200" />
                <line x1="90" y1="270" x2="390" y2="270" />
                <line x1="90" y1="340" x2="390" y2="340" />
                <line x1="90" y1="410" x2="390" y2="410" />
                <line x1="165" y1="60" x2="165" y2="480" />
                <line x1="240" y1="60" x2="240" y2="480" />
                <line x1="315" y1="60" x2="315" y2="480" />
              </g>
              <rect className="facade-line draw" x="215" y="410" width="50" height="70" />
              <g className="fade-in-svg">
                <line className="facade-line" x1="90" y1="500" x2="390" y2="500" />
                <line className="facade-line" x1="90" y1="495" x2="90" y2="505" />
                <line className="facade-line" x1="390" y1="495" x2="390" y2="505" />
                <text className="dim-text" x="205" y="518">18,60 m</text>
                <line className="facade-line" x1="420" y1="60" x2="420" y2="480" />
                <line className="facade-line" x1="415" y1="60" x2="425" y2="60" />
                <line className="facade-line" x1="415" y1="480" x2="425" y2="480" />
                <text className="dim-text" x="432" y="274" transform="rotate(90 432 274)">31,20 m</text>
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
              <div><span>Telefone</span>+55 11 0000-0000</div>
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
                <div>+55 11 0000-0000</div>
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
