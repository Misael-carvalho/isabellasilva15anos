/* =========================================================================
   CONFIGURAÇÃO DO SITE — edite aqui os dados da festa.
   Todos os textos abaixo são genéricos: troque à vontade.
   ========================================================================= */
window.SITE_CONFIG = {
  /* ---------- Debutante e evento ---------- */
  nome: "Isabella Silva",
  apelido: "Isa",
  hashtag: "#Isa15Anos",

  // Data e hora da festa (formato: AAAA-MM-DDTHH:MM:SS, horário de Brasília)
  dataEvento: "2027-03-20T20:00:00-03:00",
  duracaoHoras: 6,
  dataExtenso: "Sábado, 20 de março de 2027",
  horario: "20h00",

  // Prazo para confirmação de presença
  prazoRSVP: "20 de fevereiro de 2027",

  local: {
    nome: "Espaço de Eventos Villa Imperial",
    endereco: "Av. das Palmeiras, 1500 — Jardim Europa",
    cidade: "São Paulo — SP",
    // Texto usado para busca no mapa (pode ser o endereço completo)
    busca: "Av. Paulista, 1578, São Paulo - SP",
    referencia: "Estacionamento com manobrista no local."
  },

  dressCode: {
    titulo: "Traje Passeio Completo",
    descricao:
      "Vestidos longos ou midi para elas e terno para eles. Pedimos, com carinho, que evitem o azul-marinho e o branco — cores reservadas para a debutante.",
    sugeridas: ["#C9B68A", "#B8A2C8", "#8E9AAF", "#D8B4A0", "#6B7F6A", "#3A3A3A"],
    evitar: ["#14284B", "#FFFFFF"]
  },

  /* ---------- Contato / WhatsApp ----------
     Número com DDI + DDD, só dígitos. Usado como alternativa de confirmação
     enquanto a planilha (Google Sheets) não estiver configurada. */
  whatsapp: "5511999999999",
  contatoNome: "Família Silva",

  /* ---------- Pix (lista de presentes) ---------- */
  pix: {
    chave: "isabella15anos@email.com", // CPF, e-mail, telefone (+55...) ou chave aleatória
    recebedor: "Isabella Silva",       // até 25 caracteres
    cidade: "Sao Paulo",                // até 15 caracteres
    banco: "Banco Exemplo"
  },

  /* ---------- Integração com Google Sheets ----------
     Cole aqui a URL do Web App do Google Apps Script (veja o README).
     Deixe vazio para o "modo demonstração". */
  apiUrl: "",

  /* ---------- Lista de presentes ----------
     categoria: experiencias | moda | tecnologia | casa | cotas
     quantidade: quantas pessoas podem dar esse presente (cotas = várias)
     link: opcional — loja para quem preferir comprar o produto */
  presentes: [
    { id: "viagem",      categoria: "experiencias", nome: "Cota da Viagem dos Sonhos", descricao: "Uma contribuição para a primeira grande viagem da Isa.", valor: 150, quantidade: 30 },
    { id: "spa",         categoria: "experiencias", nome: "Dia de Princesa no Spa",   descricao: "Massagem, cabelo e unhas para um dia inesquecível.",  valor: 350, quantidade: 1 },
    { id: "show",        categoria: "experiencias", nome: "Ingresso para Show",       descricao: "Para cantar junto com o artista favorito.",          valor: 280, quantidade: 2 },
    { id: "curso",       categoria: "experiencias", nome: "Curso de Idiomas",         descricao: "Um mês de aulas para abrir as portas do mundo.",      valor: 420, quantidade: 2 },

    { id: "perfume",     categoria: "moda", nome: "Perfume Importado",       descricao: "Uma fragrância marcante para a nova fase.",      valor: 450, quantidade: 1 },
    { id: "joia",        categoria: "moda", nome: "Colar de Prata 925",      descricao: "Uma joia delicada para guardar este momento.",   valor: 320, quantidade: 1 },
    { id: "skincare",    categoria: "moda", nome: "Kit Skincare Completo",   descricao: "Cuidados diários com muito carinho.",            valor: 260, quantidade: 1 },
    { id: "bolsa",       categoria: "moda", nome: "Bolsa de Festa",          descricao: "Para acompanhar os próximos grandes eventos.",   valor: 380, quantidade: 1 },
    { id: "maquiagem",   categoria: "moda", nome: "Paleta de Maquiagem",     descricao: "Cores para todos os momentos.",                  valor: 190, quantidade: 1 },

    { id: "fone",        categoria: "tecnologia", nome: "Fone Bluetooth",        descricao: "Música em alta qualidade, em qualquer lugar.", valor: 400, quantidade: 1 },
    { id: "camera",      categoria: "tecnologia", nome: "Câmera Instantânea",    descricao: "Para registrar memórias em papel.",            valor: 550, quantidade: 1 },
    { id: "smartwatch",  categoria: "tecnologia", nome: "Smartwatch",            descricao: "Estilo e praticidade no pulso.",               valor: 700, quantidade: 1 },
    { id: "celular",     categoria: "cotas",      nome: "Cota do Celular Novo",  descricao: "Ajude a Isa a conquistar o celular novo.",     valor: 100, quantidade: 40 },

    { id: "quarto",      categoria: "casa", nome: "Decoração do Quarto",     descricao: "Um cantinho novo, com a cara dos 15 anos.",       valor: 300, quantidade: 3 },
    { id: "livros",      categoria: "casa", nome: "Coleção de Livros",       descricao: "Histórias para sonhar acordada.",                 valor: 180, quantidade: 2 },

    { id: "livre",       categoria: "cotas", nome: "Presente com Valor Livre", descricao: "Escolha o valor que desejar presentear.",       valor: 0,   quantidade: 999 }
  ],

  /* ---------- Recados de exemplo (aparecem no modo demonstração) ---------- */
  recadosExemplo: [
    { nome: "Vovó Maria", mensagem: "Minha princesa, que Deus abençoe cada passo da sua vida. Te amo infinitamente!" },
    { nome: "Tia Ana",    mensagem: "Quinze anos de luz, alegria e muito amor. Que essa noite seja mágica como você!" },
    { nome: "Júlia",      mensagem: "Amiga, mal posso esperar para dançar a noite toda com você! ✨" }
  ]
};
