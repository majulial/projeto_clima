# 🌦️ App de Clima — Aplicação Web com JavaScript e API Open-Meteo

<!-- <br />

<div align="center">
    <img src="assets/images/preview.png" /> 
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/status-concluído-green" />
  <img src="https://img.shields.io/badge/testes-jest-blue" />
  <img src="https://img.shields.io/badge/responsivo-sim-purple" />
  <img src="https://img.shields.io/badge/api-open--meteo-orange" />
</div>

<br /> -->

---

## 📖 Descrição

O **App de Clima** é uma aplicação web que permite buscar o clima de uma cidade em tempo real, utilizando a **Open-Meteo API**.

O projeto foi desenvolvido com fins educacionais, simulando uma aplicação real, com foco em:

- integração com APIs externas
- manipulação de DOM
- organização de código
- tratamento de erros
- testes automatizados com Jest

A aplicação oferece uma experiência simples e intuitiva, com suporte a diferentes dispositivos e modo noturno automático.

---

## 🎯 Sobre a aplicação

A aplicação foi construída utilizando **JavaScript puro (Vanilla JS)**, sem frameworks, seguindo boas práticas de desenvolvimento frontend.

Ela permite ao usuário:

- buscar uma cidade
- visualizar temperatura e clima atual
- navegar entre telas
- receber feedback em caso de erro

---

## 🚀 Principais funcionalidades

1. Busca de clima por cidade
2. Exibição da temperatura atual
3. Descrição do clima (ex: nublado, chuva, céu limpo)
4. Ícones dinâmicos baseados nas condições climáticas
5. Tratamento de erros:
   - input vazio
   - cidade não encontrada
6. Modo noturno automático baseado no horário
7. Layout responsivo (desktop, tablet e mobile)
8. Navegação entre telas (inicial e resultado)
9. Testes automatizados com Jest

---

## 🧪 Testes automatizados

O projeto conta com testes utilizando **Jest + jsdom**, validando:

- comportamento da interface
- validação de input
- fluxo de busca
- tratamento de erro
- atualização dinâmica da UI
- troca de ícones

---

## 🔗 Integração com API

A aplicação utiliza a **Open-Meteo API**:

- **Geocoding API** → busca da cidade
- **Forecast API** → dados climáticos atuais

Essa integração permite trabalhar com dados reais em tempo real.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia        | Descrição                          |
|------------------|----------------------------------|
| **HTML5**        | Estrutura da aplicação           |
| **CSS3**         | Estilização e responsividade     |
| **JavaScript**   | Lógica da aplicação              |
| **Jest**         | Testes automatizados             |
| **Open-Meteo**   | API de clima                     |
| **Weather Icons**| Ícones climáticos                |
| **Google Fonts** | Tipografia (Poppins)             |

---

## 📂 Estrutura do projeto

```bash
projeto_clima/
├── assets/
│   ├── js/
│   │   └── script.js
│   └── images/
├── tests/
│   └── api.test.js
├── index.html
├── style.css
├── package.json
└── README.md
```



## ⚙️ Como executar o projeto

🔹 1. Clonar o repositório

``` bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

------
🔹 2. Abrir o projeto

Você pode:

abrir o index.html diretamente no navegador
ou usar o Live Server (recomendado) no VS Code
------

🔹 3. Executar a aplicação

digite o nome de uma cidade
clique em Buscar
visualize o clima em tempo real
------

🧪 Executando os testes

🔹 Instalar dependências

```bash
npm install
```
🔹 Rodar testes
```bash
npm test
```
## 📦 Dependências

DevDependencies:

- jest
- jest-environment-jsdom
------

## 📱 Responsividade

A aplicação foi desenvolvida para funcionar em diferentes dispositivos:

- Desktop
- Tablet
- Mobile
------

## 🌙 Modo noturno

O modo noturno é ativado automaticamente com base no horário do sistema do usuário, melhorando a experiência visual.
------

## 📌 Melhorias futuras

- Adicionar loading animado
- Implementar geolocalização automática
- Adicionar cache de buscas
- Exibir mais dados climáticos (vento, umidade, etc.)
- Melhorar animações da interface
------

## 💡 Boas práticas aplicadas

- Separação de responsabilidades (UI vs lógica)
- Tratamento de erros
- Uso de API externa
- Testes automatizados
- Organização de código
- Foco em UX

------

## 🚀 Diferenciais técnicos

Este projeto demonstra:

- ✅ Integração com API real
- ✅ Manipulação dinâmica do DOM
- ✅ Testes com Jest
- ✅ Responsividade
- ✅ Modo noturno automático
- ✅ Tratamento de erros
- ✅ Estrutura organizada


------

## Licença


Este projeto foi desenvolvido para fins de estudo e portfólio.

------

## Autora



**Júlia — Desenvolvedora Full Stack**

🔗 **GitHub:** https://github.com/majulial

🔗 **LinkedIn:** https://www.linkedin.com/in/juliadlima

Projeto desenvolvido para **aprendizado contínuo**, **demonstração técnica** e **portfólio profissional**.