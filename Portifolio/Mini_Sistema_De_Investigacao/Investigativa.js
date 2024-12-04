const perguntas = [
    "1. Telefonou para a vítima?",
    "2. Esteve no local do crime?",
    "3. Mora perto da vítima?",
    "4. Devia para a vítima?",
    "5. Já trabalhou com a vítima?",
  ];

  const imagensAlertas = [
    "media/inocente.png",
    "media/suspeito.png",
    "media/cumplice.png",
    "media/carro-de-policia.png",
    "media/custodia.png",
  ];

  let respostasSim = 0;
  let perguntaAtual = 0;

  function iniciarInterrogatorio() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("interrogatorio").style.display = "block";
    mostrarPergunta();
  }

  function mostrarPergunta() {
    if (perguntaAtual < perguntas.length) {
      document.getElementById("pergunta").textContent =
        perguntas[perguntaAtual];
    } else {
      exibirResultado();
    }
  }

  function responder(resposta) {
    if (resposta === "sim") {
      respostasSim++;

      const alertaDiv = document.getElementById("alerta");
      const imagemAlerta = document.createElement("img");
      imagemAlerta.src = imagensAlertas[perguntaAtual];
      imagemAlerta.alt = `Alerta ${perguntaAtual + 1}`;
      alertaDiv.innerHTML = "";
      alertaDiv.appendChild(imagemAlerta);
    }
    perguntaAtual++;
    mostrarPergunta();
  }

  function exibirResultado() {
    document.getElementById("interrogatorio").style.display = "none";
    const resultado = document.getElementById("resultado");

    if (respostasSim === 5) {
      resultado.textContent = "Classificação: Assassino";
    } else if (respostasSim >= 3) {
      resultado.textContent = "Classificação: Cúmplice";
    } else if (respostasSim === 2) {
      resultado.textContent = "Classificação: Suspeito";
    } else {
      resultado.textContent = "Classificação: Inocente";
    }
  }