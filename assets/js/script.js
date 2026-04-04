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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day&timezone=auto`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar dados do clima.");
  }

  const dados = await resposta.json();

  return dados.current;
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
   ========================= */

function preencherResultadoComDados(cidade, clima) {
  temperatura.textContent = `${Math.round(clima.temperature_2m)}°`;

  /*
    Mostra cidade e país, como no modelo.
    Se o país não existir, mostra apenas a cidade.
  */
  cidadeResultado.textContent = formatarNomeDaCidade(cidade);

  descricaoClima.textContent = obterDescricaoDoClima(clima.weather_code);
  dataAtual.textContent = formatarDataAtual();

  definirIconePorClima(clima.weather_code, clima.is_day);
}


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

/* =========================
   INICIALIZAÇÃO
   ========================= */

aplicarModoNoturnoAutomatico();
mostrarTelaInicial();