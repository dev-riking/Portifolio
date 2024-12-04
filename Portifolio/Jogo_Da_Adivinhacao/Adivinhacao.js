let randomNumero, tentativas, nivel, timer, intervalo;

const iniciarButton = document.getElementById("iniciar");
const jogoDiv = document.getElementById("jogo");
const feedback = document.getElementById("feedback");
const userInput = document.getElementById("numero");
const submitButton = document.getElementById("submit");
const timerDisplay = document.getElementById("timer");
const nivelSelect = document.getElementById("nivel");
const nivelText = document.getElementById("nivel-text");

iniciarButton.addEventListener("click", () => {
  iniciarJogo();
});

submitButton.addEventListener("click", () => {
  if (submitButton.textContent === "Reiniciar") {
    reiniciarJogo();
    return;
  }

  const numeroso = Number(userInput.value);

  if (!numeroso || numeroso < 1 || numeroso > 100) {
    feedback.textContent = "Por favor, insira um número entre 1 e 100.";
    return;
  }

  tentativas--;

  if (numeroso === randomNumero) {
    feedback.textContent = `Parabéns! Você acertou o número gerado: ${randomNumero}.`;
    feedback.style.color = "green";
    terminarJogo();
  } else if (numeroso > randomNumero) {
    feedback.textContent = `Tente novamente! O número gerado é MENOR. Tentativas restantes: ${tentativas}.`;
    feedback.style.color = "red";
  } else {
    feedback.textContent = `Tente novamente! O número gerado é MAIOR. Tentativas restantes: ${tentativas}.`;
    feedback.style.color = "red";
  }

  if (tentativas <= 0) {
    feedback.textContent = `Fim de jogo! Você esgotou suas tentativas. O número era: ${randomNumero}.`;
    feedback.style.color = "red";
    terminarJogo();
  }

  userInput.value = "";
  userInput.focus();
});

function iniciarJogo() {
  randomNumero = Math.floor(Math.random() * 100) + 1;
  tentativas = Number(nivelSelect.value);
  nivel = nivelSelect.selectedIndex + 1;
  console.log(
    `Número gerado: ${randomNumero}, Nível: ${nivel}, Tentativas: ${tentativas}`
  );

  iniciarButton.style.display = "none";
  nivelSelect.style.display = "none";
  nivelText.style.display = "none";
  jogoDiv.style.display = "block";

  userInput.disabled = false;
  submitButton.disabled = false;
  submitButton.textContent = "Tentar";
  feedback.textContent = "";
  iniciarTimer(60);
}

function iniciarTimer(tempo) {
  timer = tempo;
  intervalo = setInterval(() => {
    timer--;
    timerDisplay.textContent = timer;

    if (timer <= 0) {
      feedback.textContent = `Fim de jogo! O tempo acabou. O número era: ${randomNumero}.`;
      feedback.style.color = "red";
      terminarJogo();
    }
  }, 1000);
}

function terminarJogo() {
  clearInterval(intervalo);
  submitButton.disabled = false;
  userInput.disabled = true;
  submitButton.textContent = "Reiniciar";
}

function reiniciarJogo() {
  clearInterval(intervalo);
  iniciarButton.style.display = "inline-block";
  nivelSelect.style.display = "inline-block";
  nivelText.style.display = "block";
  jogoDiv.style.display = "none";
  feedback.textContent = "";
  userInput.value = "";
}
