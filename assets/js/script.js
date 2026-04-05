/* =========================
   SELEÇÃO DOS ELEMENTOS
   ========================= */

const telaInicial = document.getElementById("tela-inicial");
const telaResultado = document.getElementById("tela-resultado");

const inputCidade = document.getElementById("cidade");
const botaoBuscar = document.getElementById("buscar");
const botaoVoltar = document.getElementById("voltar");

const mensagemErro = document.getElementById("mensagem-erro");

const temperatura = document.getElementById("temperatura");
const cidadeResultado = document.getElementById("cidade-resultado");
const descricaoClima = document.getElementById("descricao-clima");
const dataAtual = document.getElementById("data-atual");
const iconeClima = document.getElementById("icone-clima");

const mensagemCarregando = document.getElementById("mensagem-carregando");

// EVENTOS DO CLIMA
const climaBg = document.getElementById("clima-bg");


/* =========================
   DETALHES DO CLIMA
   ========================= */

/* Seleciona os elementos onde vamos mostrar os dados */
const umidadeElemento = document.getElementById("umidade");
const ventoElemento = document.getElementById("vento");
const sensacaoElemento = document.getElementById("sensacao");

/* =========================
   TEMPERATURA MÁXIMA E MÍNIMA
   ========================= */

/* Seleciona os elementos onde vamos mostrar a máxima e a mínima do dia */
const temperaturaMax = document.getElementById("temperatura-max");
const temperaturaMin = document.getElementById("temperatura-min");


//const { buscarCoordenadas, buscarClimaAtual } = window.weatherApi;

/* PARA ATIVAR OS TESTES BASTA TIRAR O COMENTÁRIO DA CONST ACIMA E COMENTAR AS FUNÇÕES DE BUSCAR COORDENADAS E CLIMA ATUAL ABAIXO, DEIXANSO APENAS A CONST COM O MOCK DA API. ASSIM, O JEST VAI USAR O MOCK E NÃO AS FUNÇÕES REAIS, EVITANDO ERROS DE REDE DURANTE OS TESTES. */
/* =========================


   MODO NOTURNO AUTOMÁTICO
   ========================= */

function aplicarModoNoturnoAutomatico() {
  const horaAtual = new Date().getHours();

  if (horaAtual >= 18 || horaAtual < 6) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}


/* =========================
   MODO MUDANÇA DE CLIMA BACKGROUND
     - Sol: céu limpo
     - Nublado: nuvens
     - Chuva: gotas caindo
     - Nevoa: neblina
     - Noite estrelada: céu escuro com estrelas
   ========================= */

   /**
 * Aplica uma classe de animação na camada de fundo de acordo com o tipo de clima.
 *
 * @param {string} tipoClima - Tipo visual do clima.
 * Valores esperados:
 * - "sol"
 * - "nublado"
 * - "chuva"
 * - "nevoa"
 * - "noite-estrelada"
 */
function aplicarAnimacaoDeFundo(tipoClima) {
  limparFundoClimatico();
  aplicarClimaNoBody(tipoClima);

  console.log("Aplicando fundo:", tipoClima);

  if (tipoClima === "sol") {
    climaBg.classList.add("sol");
    return;
  }

  if (tipoClima === "nublado") {
    climaBg.classList.add("nublado");
    return;
  }

  if (tipoClima === "chuva") {
    criarChuvaRealista(120);
    return;
  }

  if (tipoClima === "nevoa") {
    climaBg.classList.add("nevoa");
    return;
  }

  let estrelasAtivas = false
    if (tipoClima === "noite-estrelada") {
    climaBg.classList.add("noite-estrelada");
    criarLua();

    /* estrela cadente de vez em quando */
    if (!estrelasAtivas) {
      repetirEstrelas();
      estrelasAtivas = true;
    }

    return;
  }
}





/**
 * Define qual animação de fundo deve ser exibida
 * com base no código do clima retornado pela API e no período do dia.
 *
 * @param {number} weatherCode - Código do clima retornado pela API.
 * @param {number} isDay - Indica se é dia (1) ou noite (0).
 */
function definirFundoPorClima(weatherCode, isDay) {
  const ehDia = isDay === 1;

   console.log("weatherCode:", weatherCode, "isDay:", isDay);


  if (weatherCode === 0) {
    aplicarAnimacaoDeFundo(ehDia ? "sol" : "noite-estrelada");
    return;
  }

  if (weatherCode >= 1 && weatherCode <= 3) {
    aplicarAnimacaoDeFundo("nublado");
    return;
  }

  if (weatherCode === 45 || weatherCode === 48) {
    aplicarAnimacaoDeFundo("nevoa");
    return;
  }

  if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) {
    aplicarAnimacaoDeFundo("chuva");
    return;
  }

  if (!ehDia) {
    aplicarAnimacaoDeFundo("noite-estrelada");
    return;
  }

  aplicarAnimacaoDeFundo("nublado");
}


/**
 * Preenche a interface com os dados do clima da cidade pesquisada.
 *
 * Agora o parâmetro "clima" vem com duas partes:
 * - clima.current -> dados atuais
 * - clima.daily -> dados do dia, como máxima e mínima
 *
 * @param {Object} cidade - Dados da cidade retornados pela API.
 * @param {Object} clima - Dados climáticos atuais e diários.
 */
function preencherResultadoComDados(cidade, clima) {
  /* =========================
     DADOS ATUAIS
     ========================= */

  /* Temperatura atual */
  temperatura.textContent = `${Math.round(clima.current.temperature_2m)}°`;

  /* Nome formatado da cidade */
  cidadeResultado.textContent = formatarNomeDaCidade(cidade);

  /* Descrição do clima com base no código retornado pela API */
  descricaoClima.textContent = obterDescricaoDoClima(clima.current.weather_code);

  /* Data atual formatada em português */
  dataAtual.textContent = formatarDataAtual();

  /* Define o ícone do clima */
  definirIconePorClima(clima.current.weather_code, clima.current.is_day);

  /* Define o fundo animado conforme o clima */
  definirFundoPorClima(clima.current.weather_code, clima.current.is_day);

  /* =========================
     DETALHES DO CLIMA
     ========================= */

  /* Umidade do ar */
  umidadeElemento.textContent = `${clima.current.relative_humidity_2m}%`;

  /* Velocidade do vento */
  ventoElemento.textContent = `${clima.current.wind_speed_10m} km/h`;

  /* Sensação térmica */
  sensacaoElemento.textContent = `${Math.round(clima.current.apparent_temperature)}°`;

  /* =========================
     MÁXIMA E MÍNIMA
     ========================= */

  /*
    A Open-Meteo devolve temperatura máxima e mínima
    dentro de arrays em "daily".
    Como pedimos apenas 1 dia, usamos o índice [0].
  */
  temperaturaMax.textContent = `${Math.round(clima.daily.temperature_2m_max[0])}°`;
  temperaturaMin.textContent = `${Math.round(clima.daily.temperature_2m_min[0])}°`;
}


/* =========================
    LIMPAR FUNDO CLIMATICO
   ========================= */   

/**
 * Remove todos os elementos internos e classes da camada climática,
 * preparando o fundo para receber uma nova animação.
 */
function limparFundoClimatico() {
  climaBg.className = "clima-bg";
  climaBg.innerHTML = "";
}

/* =========================
   FUNÇÃO PARA CRIAR CHUVAS 
   ========================= */  

   /**
 * Cria um efeito de chuva com gotas individuais.
 *
 * A função gera várias gotas com tamanhos, posições e durações diferentes
 * para deixar o efeito mais natural e realista.
 *
 * @param {number} quantidade - Número de gotas que serão criadas.
 */
function criarChuvaRealista(quantidade = 120) {
  limparFundoClimatico();
  climaBg.classList.add("chuva");

  for (let i = 0; i < quantidade; i++) {
    const gota = document.createElement("span");
    gota.classList.add("raindrop");

    /* Variação de tamanho para dar profundidade */
    const sorteio = Math.random();

    if (sorteio > 0.7) {
      gota.classList.add("big");
    } else if (sorteio < 0.3) {
      gota.classList.add("small");
    }

    /* Posição horizontal aleatória */
    gota.style.left = `${Math.random() * 100}%`;

    /* Duração aleatória para não cair tudo igual */
    gota.style.animationDuration = `${0.5 + Math.random() * 0.9}s`;

    /* Atraso aleatório para distribuir o início */
    gota.style.animationDelay = `${Math.random() * 2}s`;

    /* Opacidade variável */
    gota.style.opacity = `${0.35 + Math.random() * 0.6}`;

    climaBg.appendChild(gota);
  }
}

/* =========================
   CONTROLE DE TELAS
   ========================= */

function mostrarTelaInicial() {
  telaInicial.classList.add("active");
  telaInicial.classList.remove("hidden");

  telaResultado.classList.remove("active");
  telaResultado.classList.add("hidden");
}

function mostrarTelaResultado() {
  telaInicial.classList.remove("active");
  telaInicial.classList.add("hidden");

  telaResultado.classList.add("active");
  telaResultado.classList.remove("hidden");
}


/* =========================
   FUNÇÃO NUBLADO
   ========================= */

/**
 * Atualiza a aparência geral do body de acordo com o clima principal.
 *
 * @param {string} tipoClima - Clima visual principal do app.
 */
function aplicarClimaNoBody(tipoClima) {
  document.body.classList.remove("clima-nublado");

  if (tipoClima === "nublado") {
    document.body.classList.add("clima-nublado");
  }
}


/* =========================
   FUNÇÃO LUA E ESTRELAS
   ========================= */

/**
 * Cria uma lua discreta para o fundo noturno.
 */
function criarLua() {
  const lua = document.createElement("div");
  lua.classList.add("lua");
  climaBg.appendChild(lua);

}

/**
 * Cria uma estrela cadente discreta no fundo noturno.
 */
function criarEstrelaCadente() {
  const estrela = document.createElement("div");
  estrela.classList.add("estrela-cadente");
  climaBg.appendChild(estrela);

  setTimeout(() => {
    estrela.remove();
  }, 1500);
}

function repetirEstrelas() {
  setInterval(() => {
    criarEstrelaCadente();
  }, 5000); // frequência
}

/* =========================
   CONTROLE DE ERRO
   ========================= */

function mostrarErro() {
  mensagemErro.classList.remove("hidden");
}

function esconderErro() {
  mensagemErro.classList.add("hidden");
}


/* =========================
   FORMATAÇÃO DE DATA
   ========================= */

function formatarDataAtual() {
  const data = new Date();

  return data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}


/* =========================
   ÍCONES DA BIBLIOTECA
   ========================= */

/*
  Mantemos sempre:
  - weather-icon -> seu estilo
  - wi -> classe base da biblioteca

  E trocamos apenas a classe do ícone.
*/
function atualizarClasseDoIcone(nomeClasse) {
  iconeClima.className = `weather-icon wi ${nomeClasse}`;
}


/* =========================
   DESCRIÇÃO DO CLIMA
   ========================= */

/*
  A Open-Meteo usa códigos WMO de weather_code.
  Aqui transformamos o número em texto em português.
*/
function obterDescricaoDoClima(weatherCode) {
  if (weatherCode === 0) return "Céu limpo";
  if (weatherCode >= 1 && weatherCode <= 3) return "Nublado";
  if (weatherCode === 45 || weatherCode === 48) return "Neblina";
  if (weatherCode >= 51 && weatherCode <= 57) return "Garoa";
  if (weatherCode >= 61 && weatherCode <= 67) return "Chuva";
  if (weatherCode >= 71 && weatherCode <= 77) return "Neve";
  if (weatherCode >= 80 && weatherCode <= 82) return "Pancadas de chuva";
  if (weatherCode >= 85 && weatherCode <= 86) return "Pancadas de neve";
  if (weatherCode >= 95 && weatherCode <= 99) return "Tempestade";

  return "Clima indisponível";
}


/* =========================
   MAPEAMENTO DOS ÍCONES
   ========================= */

/*
  A Open-Meteo retorna também "is_day":
  - 1 = dia
  - 0 = noite

  Isso ajuda a trocar ícones de dia e noite.
*/
function definirIconePorClima(weatherCode, isDay) {
  const ehDia = isDay === 1;

  if (weatherCode === 0) {
    atualizarClasseDoIcone(ehDia ? "wi-day-sunny" : "wi-night-clear");
    return;
  }

  if (weatherCode >= 1 && weatherCode <= 3) {
    atualizarClasseDoIcone(ehDia ? "wi-day-cloudy" : "wi-night-alt-cloudy");
    return;
  }

  if (weatherCode === 45 || weatherCode === 48) {
    atualizarClasseDoIcone("wi-fog");
    return;
  }

  if (weatherCode >= 51 && weatherCode <= 57) {
    atualizarClasseDoIcone(ehDia ? "wi-day-sprinkle" : "wi-night-alt-sprinkle");
    return;
  }

  if (weatherCode >= 61 && weatherCode <= 67) {
    atualizarClasseDoIcone(ehDia ? "wi-day-rain" : "wi-night-alt-rain");
    return;
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    atualizarClasseDoIcone(ehDia ? "wi-day-snow" : "wi-night-alt-snow");
    return;
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    atualizarClasseDoIcone(ehDia ? "wi-day-showers" : "wi-night-alt-showers");
    return;
  }

  if (weatherCode >= 85 && weatherCode <= 86) {
    atualizarClasseDoIcone(ehDia ? "wi-day-snow" : "wi-night-alt-snow");
    return;
  }

  if (weatherCode >= 95 && weatherCode <= 99) {
    atualizarClasseDoIcone(ehDia ? "wi-day-thunderstorm" : "wi-night-alt-thunderstorm");
    return;
  }

  atualizarClasseDoIcone("wi-cloud");
}


/* =========================
   BUSCAR COORDENADAS DA CIDADE
   ========================= */

/*
  Primeiro buscamos a cidade digitada.
  A API retorna dados como nome, país, latitude e longitude.
*/
async function buscarCoordenadas(nomeCidade) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar coordenadas da cidade.");
  }

  const dados = await resposta.json();

  if (!dados.results || dados.results.length === 0) {
    return null;
  }

  return dados.results[0];
}


/* =========================
   BUSCAR CLIMA ATUAL
   ========================= */

/*
  Depois que temos latitude e longitude,
  buscamos os dados atuais do clima.
*/
async function buscarClimaAtual(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation&daily=temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar dados do clima.");
  }

  const dados = await resposta.json();

  return {
    current: dados.current,
    daily: dados.daily
  };
}
/* ========================= */

/* Exibe a mensagem de carregamento */
function mostrarCarregando() {
  mensagemCarregando.classList.remove("hidden");
}

/* Esconde a mensagem de carregamento */
function esconderCarregando() {
  mensagemCarregando.classList.add("hidden");
}


/* =========================
   PREENCHER A TELA DE RESULTADO


  FUNÇÃO RETIRADA POIS ESTAVA DUPLICADA, MAS ESTOU ESPERANDO PRA VER SE MAIS TARDE FICA 


   ========================= */

// function preencherResultadoComDados(cidade, clima) {
//   temperatura.textContent = `${Math.round(clima.temperature_2m)}°`;

//   /*
//     Mostra cidade e país, como no modelo.
//     Se o país não existir, mostra apenas a cidade.
//   */
//   cidadeResultado.textContent = formatarNomeDaCidade(cidade);

//   descricaoClima.textContent = obterDescricaoDoClima(clima.weather_code);
//   dataAtual.textContent = formatarDataAtual();

//   definirIconePorClima(clima.weather_code, clima.is_day);
// }


/* =========================
   MELHORANDO O NOME DA CIDADE
     - Se a cidade tiver admin1 (estado), mostra também
     - Se a cidade tiver país, mostra também.
   ========================= */


function formatarNomeDaCidade(cidade) {
  const partes = [cidade.name];

  if (cidade.admin1) {
    partes.push(cidade.admin1);
  }

  if (cidade.country) {
    partes.push(cidade.country);
  }

  return partes.join(", ");
}


/* =========================
   EVENTO DO BOTÃO BUSCAR
   ========================= */

botaoBuscar.addEventListener("click", async () => {
  const cidadeDigitada = inputCidade.value.trim();

  esconderErro();
  esconderCarregando();

  if (cidadeDigitada === "") {
    mostrarErro();
    return;
  }

  try {
    /* Mostra mensagem enquanto busca */
    mostrarCarregando();

    const cidade = await buscarCoordenadas(cidadeDigitada);

    if (!cidade) {
      esconderCarregando();
      mostrarErro();
      return;
    }

    const clima = await buscarClimaAtual(cidade.latitude, cidade.longitude);

    preencherResultadoComDados(cidade, clima);

    esconderCarregando();
    mostrarTelaResultado();
  } catch (erro) {
    console.error("Erro ao buscar clima:", erro);
    esconderCarregando();
    mostrarErro(erro.message);
  }
});

/* =========================
   BOTÃO VOLTAR
   ========================= */

botaoVoltar.addEventListener("click", () => {
  inputCidade.value = "";
  esconderErro();
  esconderCarregando();
  mostrarTelaInicial();
});


/* =========================
   BUSCA COM ENTER
   ========================= */

inputCidade.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    botaoBuscar.click();
  }
});

/* =========================
   TESTE NO JEST
   ========================= */

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    aplicarModoNoturnoAutomatico,
    mostrarTelaInicial,
    mostrarTelaResultado,
    mostrarErro,
    esconderErro,
    mostrarCarregando,
    esconderCarregando,
    formatarDataAtual,
    formatarNomeDaCidade,
    atualizarClasseDoIcone,
    obterDescricaoDoClima,
    definirIconePorClima,
    preencherResultadoComDados
  };
}


/**
 * Inicializa a aplicação com o tema noturno automático,
 * tela inicial visível e um fundo padrão.
 */
function inicializarAplicacao() {
  aplicarModoNoturnoAutomatico();
  mostrarTelaInicial();
  aplicarAnimacaoDeFundo(); // Fundo neutro para o iníci
}

/* =========================
   INICIALIZAÇÃO
   ========================= */


  criarEstrelaCadente(); // Para mostrar uma estrela cadente logo no início, dando vida ao fundo noturno

inicializarAplicacao();