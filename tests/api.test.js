/**
 * @jest-environment jsdom
 */

describe("Testes do script.js", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main class="app">
        <section class="card">
          <section id="tela-inicial" class="screen active">
            <h1 class="title">Previsão do Tempo</h1>

            <div class="search-box">
              <input
                type="text"
                id="cidade"
                class="search-input"
                placeholder="Digite o nome da cidade"
              >
              <button id="buscar" class="search-button">Buscar</button>
            </div>

            <div id="mensagem-carregando" class="loading-message hidden">
              Buscando informações...
            </div>

            <div id="mensagem-erro" class="error-message hidden">
              Cidade não encontrada. Tente novamente.
            </div>
          </section>

          <section id="tela-resultado" class="screen hidden">
            <div class="weather-box">
              <i id="icone-clima" class="weather-icon wi wi-day-cloudy"></i>
              <h2 id="temperatura" class="temperature">21°</h2>
            </div>

            <h3 id="cidade-resultado" class="city-name">São Paulo, Brasil</h3>
            <p id="descricao-clima" class="weather-description">Nublado</p>
            <p id="data-atual" class="weather-date">segunda-feira, 13 de outubro de 2025</p>

            <button id="voltar" class="home-button" aria-label="Voltar para a busca">
              Voltar
            </button>
          </section>
        </section>
      </main>
    `;

    window.weatherApi = {
      buscarCoordenadas: jest.fn(),
      buscarClimaAtual: jest.fn()
    };
    jest.spyOn(console, "error").mockImplementation(() => {});

    jest.resetModules();
    require("../assets/js/script.js");

  });

    afterEach(() => {
  jest.restoreAllMocks();
});

  test("deve mostrar erro quando o input estiver vazio", async () => {
    const botaoBuscar = document.getElementById("buscar");
    const mensagemErro = document.getElementById("mensagem-erro");

    botaoBuscar.click();

    expect(mensagemErro.classList.contains("hidden")).toBe(false);
    expect(mensagemErro.textContent.trim()).toBe("Cidade não encontrada. Tente novamente.");
  });

  test("deve buscar cidade e mostrar resultado quando a busca for válida", async () => {
    const inputCidade = document.getElementById("cidade");
    const botaoBuscar = document.getElementById("buscar");
    const telaInicial = document.getElementById("tela-inicial");
    const telaResultado = document.getElementById("tela-resultado");

    window.weatherApi.buscarCoordenadas.mockResolvedValue({
      name: "Rio de Janeiro",
      admin1: "Rio de Janeiro",
      country: "Brasil",
      latitude: -22.9,
      longitude: -43.2
    });

    window.weatherApi.buscarClimaAtual.mockResolvedValue({
      temperature_2m: 26,
      weather_code: 3,
      is_day: 1
    });

    inputCidade.value = "Rio de Janeiro";
    botaoBuscar.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(window.weatherApi.buscarCoordenadas).toHaveBeenCalledWith("Rio de Janeiro");
    expect(window.weatherApi.buscarClimaAtual).toHaveBeenCalledWith(-22.9, -43.2);

    expect(telaInicial.classList.contains("active")).toBe(false);
    expect(telaResultado.classList.contains("active")).toBe(true);

    expect(document.getElementById("temperatura").textContent).toBe("26°");
    expect(document.getElementById("cidade-resultado").textContent).toBe("Rio de Janeiro, Rio de Janeiro, Brasil");
    expect(document.getElementById("descricao-clima").textContent).toBe("Nublado");
  });

  test("deve mostrar erro quando a cidade não for encontrada", async () => {
    const inputCidade = document.getElementById("cidade");
    const botaoBuscar = document.getElementById("buscar");
    const mensagemErro = document.getElementById("mensagem-erro");

    window.weatherApi.buscarCoordenadas.mockRejectedValue(
      new Error("Cidade não encontrada")
    );

    inputCidade.value = "abcdefgh";
    botaoBuscar.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(mensagemErro.classList.contains("hidden")).toBe(false);
    expect(mensagemErro.textContent.trim()).toBe("Cidade não encontrada. Tente novamente.");
  });

  test("deve voltar para a tela inicial ao clicar no botão voltar", async () => {
    const inputCidade = document.getElementById("cidade");
    const botaoBuscar = document.getElementById("buscar");
    const botaoVoltar = document.getElementById("voltar");

    window.weatherApi.buscarCoordenadas.mockResolvedValue({
      name: "Rio de Janeiro",
      admin1: "Rio de Janeiro",
      country: "Brasil",
      latitude: -22.9,
      longitude: -43.2
    });

    window.weatherApi.buscarClimaAtual.mockResolvedValue({
      temperature_2m: 26,
      weather_code: 0,
      is_day: 1
    });

    inputCidade.value = "Rio de Janeiro";
    botaoBuscar.click();

    await Promise.resolve();
    await Promise.resolve();

    botaoVoltar.click();

    expect(document.getElementById("tela-inicial").classList.contains("active")).toBe(true);
    expect(document.getElementById("tela-resultado").classList.contains("active")).toBe(false);
    expect(document.getElementById("cidade").value).toBe("");
  });

  test("deve trocar a classe do ícone conforme o clima", async () => {
    const inputCidade = document.getElementById("cidade");
    const botaoBuscar = document.getElementById("buscar");
    const iconeClima = document.getElementById("icone-clima");

    window.weatherApi.buscarCoordenadas.mockResolvedValue({
      name: "Rio de Janeiro",
      admin1: "Rio de Janeiro",
      country: "Brasil",
      latitude: -22.9,
      longitude: -43.2
    });

    window.weatherApi.buscarClimaAtual.mockResolvedValue({
      temperature_2m: 30,
      weather_code: 0,
      is_day: 1
    });

    inputCidade.value = "Rio de Janeiro";
    botaoBuscar.click();

    await Promise.resolve();
    await Promise.resolve();

    expect(iconeClima.className).toContain("wi-day-sunny");
  });
});