const imoveis = [
  {
    id: 1,
    tipo: "Apartamento",
    titulo: "Apartamento a venda em Francisco Morato",
    localizacao: "São Paulo - Francisco Morato",
    preco: "R$ 46.000,00",

    imagens: [
        "/imoves/apart-1/capa.jpeg",
        "/imoves/apart-1/2.jpeg",
        "/imoves/apart-1/3.jpeg",
        "/imoves/apart-1/4.jpeg",
        "/imoves/apart-1/5.jpeg",
        "/imoves/apart-1/6.jpeg",
        "/imoves/apart-1/7.jpeg",
        "/imoves/apart-1/8.jpeg",
        "/imoves/apart-1/9.jpeg",
        "/imoves/apart-1/10.jpeg",
        "/imoves/apart-1/11.jpeg",
        "/imoves/apart-1/12.jpeg",
        "/imoves/apart-1/13.jpeg",
        "/imoves/apart-1/14.jpeg",
        "/imoves/apart-1/15.jpeg",
        "/imoves/apart-1/16.jpeg",
        "/imoves/apart-1/17.jpeg",
        "/imoves/apart-1/18.jpeg",
        "/imoves/apart-1/19.jpeg",
    ],

    detalhes: {
      quartos: 2,
      sala: 1,
      banheiros: 1,
      vagas: 1,
      area: "320 m²",
    },

    descricao: `
Conquiste o sonho de seu imóvel próprio.

2 Dormitórios
Sala
Banheiro
Cozinha
Varanda
Área de serviço
1 Vaga de garagem

Condições de negociação:

Valor pedido pelo proprietário: R$ 46.000,00
Saldo a refinanciar aproximadamente: R$ 124.000,00

O condomínio possui:
Piscina, Salão de festas, Churrasqueira, Playground, Quadra e Mini mercado.

Valor: 170 mil.
`,
    video: "",
  },

  {
    id: 2,
    tipo: "APARTAMENTO",
    titulo: "Residencial Castellari",
    localizacao: "São Paulo",
    preco: "R$ 1.250.000",

    imagens: [],

    detalhes: {
      quartos: 3,
      suites: 1,
      banheiros: 3,
      vagas: 2,
      area: "180 m²",
    },

    descricao:
      "Apartamento de alto padrão com arquitetura contemporânea e localização privilegiada.",

    video: "",
  },
];

export default imoveis;