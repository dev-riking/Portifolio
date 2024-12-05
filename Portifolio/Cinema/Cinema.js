let reservas = JSON.parse(localStorage.getItem('reservas')) || {};
let assentosSelecionados = [];
let horarioSelecionado = null;
let tipoSala = 'tradicional';
let filmeSelecionado = null;
let assentosExibidos = false;  // Variável para controlar a exibição de assentos

const salas = { tradicional: 70, vip: 35 };

const horariosFilmes = {
    filme1: ["18:00", "19:30", "21:30"],
    filme2: ["18:30", "20:30", "22:00"],
    filme3: ["18:00", "19:30", "21:45"]
};

function salvarReservas() {
    localStorage.setItem('reservas', JSON.stringify(reservas));
}

// Função para formatar a data no formato dd/mm/aaaa
function formatarDataPtBr(dataIso) {
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
}

function selecionarFilme(filme) {
    filmeSelecionado = filme;
    const cards = document.querySelectorAll('.filme-card');
    cards.forEach(card => card.classList.remove('selecionado'));
    document.getElementById(filme).classList.add('selecionado');
    atualizarHorarios();
    
    // Limpa os assentos ao mudar de filme
    assentosSelecionados = [];
    const assentos = document.querySelectorAll('.assento');
    assentos.forEach(assento => assento.classList.remove('selecionado', 'reservado'));
}

function atualizarHorarios() {
    const data = document.getElementById('data').value;
    if (!data || !filmeSelecionado) return;

    const horarios = horariosFilmes[filmeSelecionado] || ["14:00", "17:00", "20:00"];

    const horariosContainer = document.getElementById('horarios-container');
    horariosContainer.innerHTML = '';
    horariosContainer.style.display = 'flex';

    horarios.forEach(horario => {
        const botao = document.createElement('button');
        botao.classList.add('botao-horario');
        botao.textContent = horario;
        botao.onclick = () => selecionarHorario(botao, horario);
        horariosContainer.appendChild(botao);
    });
}

function selecionarHorario(botao, horario) {
    const botoes = document.querySelectorAll('.botao-horario');
    botoes.forEach(b => b.classList.remove('selecionado'));
    botao.classList.add('selecionado');
    horarioSelecionado = horario;
}

function exibirAssentos() {
    const data = document.getElementById('data').value;
    if (!data || !horarioSelecionado) {
        alert('Por favor, selecione a data e um horário.');
        return;
    }

    tipoSala = document.getElementById('sala').value;
    const numAssentos = salas[tipoSala];

    const chaveReserva = `${data}_${horarioSelecionado}_${tipoSala}`;
    const assentosReservados = reservas[chaveReserva] || [];

    document.getElementById('sessao-info').innerText =
        `Data: ${formatarDataPtBr(data)}, Horário: ${horarioSelecionado}, Sala: ${tipoSala}`;

    const assentosContainer = document.getElementById('assentos');
    assentosContainer.innerHTML = '';

    for (let i = 1; i <= numAssentos; i++) {
        const assento = document.createElement('div');
        assento.classList.add('assento');
        assento.textContent = i;
        assento.onclick = () => selecionarAssento(i);
        if (assentosReservados.includes(i)) {
            assento.classList.add('reservado');
        }
        assentosContainer.appendChild(assento);
    }

    // Alterna a exibição dos assentos
    if (assentosExibidos) {
        document.getElementById('assentos-container').style.display = 'none';
    } else {
        document.getElementById('assentos-container').style.display = 'block';
    }
    
    // Alterna o estado de assentos exibidos
    assentosExibidos = !assentosExibidos;
}

function selecionarAssento(assentoId) {
    const assento = document.querySelector(`.assento:nth-child(${assentoId})`);
    if (assento.classList.contains('reservado')) return;

    if (assento.classList.contains('selecionado')) {
        assento.classList.remove('selecionado');
        assentosSelecionados = assentosSelecionados.filter(id => id !== assentoId);
    } else {
        assento.classList.add('selecionado');
        assentosSelecionados.push(assentoId);
    }
}

function finalizarReserva() {
    const data = document.getElementById('data').value;
    if (!data || assentosSelecionados.length === 0) {
        alert('Por favor, selecione os assentos.');
        return;
    }

    const chaveReserva = `${data}_${horarioSelecionado}_${tipoSala}`;
    if (!reservas[chaveReserva]) {
        reservas[chaveReserva] = [];
    }

    reservas[chaveReserva].push(...assentosSelecionados);
    salvarReservas();

    exibirResumo();
}

function exibirResumo() {
    const listaAssentos = document.getElementById('lista-assentos');
    listaAssentos.innerHTML = '';

    assentosSelecionados.forEach(assento => {
        const li = document.createElement('li');
        li.textContent = `Assento ${assento}`;
        listaAssentos.appendChild(li);
    });

    const resumoContainer = document.getElementById('resumo');
    resumoContainer.innerHTML = `
        <h2>Resumo da Reserva</h2>
        <p><strong>Data:</strong> ${formatarDataPtBr(document.getElementById('data').value)}</p>
        <p><strong>Filme:</strong> ${document.querySelector('.filme-card.selecionado')?.textContent.trim()}</p>
        <p><strong>Horário:</strong> ${horarioSelecionado}</p>
        <p><strong>Sala:</strong> ${tipoSala === 'vip' ? 'VIP' : 'Tradicional'}</p>
        <h3>Assentos Selecionados:</h3>
        <ul id="lista-assentos">
            ${assentosSelecionados.map(assento => `<li>Assento ${assento}</li>`).join('')}
        </ul>
        <button onclick="resetarSistema()">Nova Reserva</button>
    `;

    document.getElementById('assentos-container').style.display = 'none';
    resumoContainer.style.display = 'block';
}

function resetarSistema() {
    assentosSelecionados = [];
    filmeSelecionado = null;
    horarioSelecionado = null;
    assentosExibidos = false;  // Resetando a variável para permitir reexibir os assentos
    document.getElementById('data').value = '';
    document.getElementById('horarios-container').style.display = 'none';
    document.getElementById('assentos-container').style.display = 'none';
    document.getElementById('resumo').style.display = 'none';
    document.querySelectorAll('.filme-card').forEach(card => card.classList.remove('selecionado'));
    document.querySelectorAll('.botao-horario').forEach(b => b.classList.remove('selecionado'));
}
