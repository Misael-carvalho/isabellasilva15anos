/* =========================================================================
   CONFIGURAÇÃO DO SITE — edite aqui os dados da festa.
   Todos os textos abaixo são genéricos: troque à vontade.
   ========================================================================= */
window.SITE_CONFIG = {
  /* ---------- Debutante e evento ---------- */
  nome: "Isabella Silva",
  apelido: "Bella",
  hashtag: "#Isa15Anos",

  // Data e hora da festa (formato: AAAA-MM-DDTHH:MM:SS, horário de Brasília)
  dataEvento: "2026-12-19T10:00:00-03:00",
  duracaoHoras: 4,
  dataExtenso: "Sábado, 19 de dezembro de 2026",
  horario: "19h00",

  // Prazo para confirmação de presença
  prazoRSVP: "12 de dezembro de 2026",

  local: {
    nome: "Espaço de Eventos Cerimonial Reis",
    endereco: "Av. Cláudio Manoel da Costa, 1970 - Interlagos",
    cidade: "Linhares - ES",
    // Texto usado para busca no mapa (pode ser o endereço completo)
    busca: "Av. Cláudio Manoel da Costa, 1970 - Interlagos, Linhares - ES, 29903-092",
    referencia: "Estacionamento na rua, frente do local."
  },

  dressCode: {
    titulo: "Traje",
    descricao:
      "Pedimos, com carinho, que evitem o azul-marinho — cor reservada para a debutante.",
    sugeridas: ["#C9B68A", "#B8A2C8", "#8E9AAF", "#D8B4A0", "#6B7F6A", "#3A3A3A"],
    evitar: ["#14284B"]
  },

  /* ---------- Contato / WhatsApp ----------
     Número com DDI + DDD, só dígitos. Usado como alternativa de confirmação
     enquanto a planilha (Google Sheets) não estiver configurada. */
  whatsapp: "5527996528445",
  contatoNome: "Fabiana Andrade",

  /* ---------- Pix (lista de presentes) ---------- */
  pix: {
    chave: "+5527997601485", // CPF, e-mail, telefone (+55 + DDD + número) ou chave aleatória
    recebedor: "Isabella Silva",       // até 25 caracteres
    cidade: "Linhares",                // até 15 caracteres
    banco: "Picpay"
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
    { id: "livre",       categoria: "cotas", nome: "Presente com Valor Livre", descricao: "Escolha o valor que desejar presentear.",       valor: 0,   quantidade: 999 },
    
    { id: "viagem",      categoria: "experiencias", nome: "Cota da Viagem dos Sonhos", descricao: "Uma contribuição para a primeira grande viagem da Isa.", valor: 100, quantidade: 30 },
    { id: "spa",         categoria: "experiencias", nome: "Dia de Princesa no Spa",   descricao: "Massagem, cabelo e unhas para um dia inesquecível.",  valor: 150, quantidade: 1 },
    { id: "curso",       categoria: "experiencias", nome: "Curso de Idiomas",         descricao: "Um mês de aulas para abrir as portas do mundo.",      valor: 120, quantidade: 1 },

    { id: "perfume",     categoria: "moda", nome: "Perfume",       descricao: "Uma fragrância marcante para a nova fase.",      valor: 88, quantidade: 1 },
    { id: "joia",        categoria: "moda", nome: "Colar",      descricao: "Uma joia delicada para guardar este momento.",   valor: 110, quantidade: 1 },
    { id: "skincare",    categoria: "moda", nome: "Kit Skincare Completo",   descricao: "Cuidados diários com muito carinho.",            valor: 155, quantidade: 1 },
    { id: "bolsa",       categoria: "moda", nome: "Bolsa de Festa",          descricao: "Para acompanhar os próximos grandes eventos.",   valor: 143, quantidade: 1 },
    { id: "maquiagem",   categoria: "moda", nome: "Paleta de Maquiagem",     descricao: "Cores para todos os momentos.",                  valor: 190, quantidade: 1 },

    { id: "celular",     categoria: "cotas",      nome: "Cota do Celular Novo",  descricao: "Ajude a Isa a conquistar o celular novo.",     valor: 99, quantidade: 16 },

    { id: "livros",      categoria: "casa", nome: "Coleção de Livros",       descricao: "Histórias para sonhar acordada.",               valor: 180, quantidade: 2 },

  ],

  /* ---------- Recados de exemplo (aparecem no modo demonstração) ---------- */
  recadosExemplo: [
    { nome: "Vovó Penha", mensagem: "Minha princesa, que Deus abençoe cada passo da sua vida. Te amo infinitamente!" },
    { nome: "Tia Ana",    mensagem: "Quinze anos de luz, alegria e muito amor. Que essa noite seja mágica como você!" },
    { nome: "Júlia",      mensagem: "Amiga, mal posso esperar para dançar a noite toda com você! ✨" }
  ]
};
