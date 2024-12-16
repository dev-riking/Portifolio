const apiUrl = "https://pokeapi.co/api/v2/pokemon";
let player1Deck = [],
  player2Deck = [],
  gameMode = "",
  currentPlayer = 1,
  battleLog = "";
let player1Score = 0,
  player2Score = 0;

const getRandomPokemon = () =>
  fetch(`${apiUrl}/${Math.floor(Math.random() * 151) + 1}`).then((res) =>
    res.json()
  );

const calculatePower = (pokemon) =>
  pokemon.stats[1].base_stat +
  pokemon.stats[2].base_stat +
  pokemon.stats[5].base_stat;

const getColorByPower = (power) => {
  if (power < 100) return "gray";
  if (power < 200) return "magenta";
  if (power < 300) return "yellow";
  return "orange";
};

const displayPokemon = (pokemon, containerId) => {
  const card = document.createElement("div");
  card.className = "card";

  const cardInner = document.createElement("div");
  cardInner.className = "card-inner";

  const cardFront = document.createElement("div");
  cardFront.className = "card-front";
  const power = calculatePower(pokemon);
  cardFront.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }" style="width: 180px; height: 180px; margin-top: -90px; margin-bottom: -40px;">
        <p style="color: ${getColorByPower(
          power
        )}">${pokemon.name.toUpperCase()}</p>
        <p>ATAQUE: ${pokemon.stats[1].base_stat}</p>
        <p>DEFESA: ${pokemon.stats[2].base_stat}</p>
        <p>FORÇA: ${pokemon.stats[5].base_stat}</p>`;

  const cardBack = document.createElement("div");
  cardBack.className = "card-back";
  cardBack.innerText = "❓";

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
    if (card.classList.contains("flipped")) {
      cardFront.style.display = "flex";
    } else {
      cardFront.style.display = "none";
    }
  });

  document.getElementById(containerId).appendChild(card);
};

const setGameMode = (mode) => {
  gameMode = mode;
  document.getElementById("mode-1v1").style.display = "none";
  document.getElementById("draw-pokemon").style.display = "inline-block";
};

document
  .getElementById("mode-1v1")
  .addEventListener("click", () => setGameMode("1v1"));

document.getElementById("draw-pokemon").addEventListener("click", () => {
  if (currentPlayer === 1 && player1Deck.length < 5) {
    getRandomPokemon().then((player1Pokemon) => {
      player1Deck.push(player1Pokemon);
      displayPokemon(player1Pokemon, "player1-deck");
      toggleTurn();
    });
  } else if (currentPlayer === 2 && player2Deck.length < 5) {
    getRandomPokemon().then((player2Pokemon) => {
      player2Deck.push(player2Pokemon);
      displayPokemon(player2Pokemon, "player2-deck");
      toggleTurn();
    });
  }
});

const toggleTurn = () => {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  if (player1Deck.length === 1 && player2Deck.length === 1) {
    document.getElementById("start-battle").style.display = "inline-block";
  }
};

document.getElementById("start-battle").addEventListener("click", () => {
  document.getElementById("start-battle").style.display = "none";
  playRound();
});

const playRound = () => {
  let player1Pokemon = player1Deck.shift();
  let player2Pokemon = player2Deck.shift();

  let player1Power = calculatePower(player1Pokemon);
  let player2Power = calculatePower(player2Pokemon);

  let winner =
    player1Power > player2Power
      ? "Jogador 1"
      : player2Power > player1Power
      ? "Jogador 2"
      : "Empate";

  battleLog += `
        <p><b>${player1Pokemon.name.toUpperCase()}</b> (${player1Power}) VS <b>${player2Pokemon.name.toUpperCase()}</b> (${player2Power}) - <span class="battle-result">${winner}</span></p>
      `;

  document.getElementById("battle-log").innerHTML = battleLog;
  if (winner === "Jogador 1") player1Score++;
  if (winner === "Jogador 2") player2Score++;

  document.getElementById("player1-score").textContent = player1Score;
  document.getElementById("player2-score").textContent = player2Score;

  if (player1Deck.length === 0 || player2Deck.length === 0) {
    document.getElementById("restart-btn").style.display = "inline-block";
  }
};

document
  .getElementById("restart-btn")
  .addEventListener("click", () => location.reload());
