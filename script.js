// =========================
// LINK DA PLANILHA CSV
// =========================

const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// =========================
// BUSCAR DADOS
// =========================

async function atualizarDados() {
    try {

        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();

        const linhas = csvText
            .trim()
            .split('\n')
            .filter(linha => linha.trim() !== '');

        if (linhas.length < 2) return;

        // Remove o cabeçalho
        const dados = linhas.slice(1);

        // Último registro
        const ultimaLinha = dados[dados.length - 1]
            ? dados[dados.length - 1].split(',')
            : ["--", "--", "--", "--"];

        // Penúltimo registro
        const penultimaLinha = dados[dados.length - 2]
            ? dados[dados.length - 2].split(',')
            : ["--", "--", "--", "--"];

        // =========================
        // DADOS ATUAIS
        // =========================

        const nomeAtual = ultimaLinha[0] || "--";
        const dataAtual = `${ultimaLinha[1] || "--"} ${ultimaLinha[2] || ""}`;
        const clienteAtual = ultimaLinha[3] || "--";

        const nomeAnterior = penultimaLinha[0] || "--";
        const dataAnterior = `${penultimaLinha[1] || "--"} ${penultimaLinha[2] || ""}`;
        const clienteAnterior = penultimaLinha[3] || "--";

        // =========================
        // ABA MONITORAR
        // =========================

        const monitorAtual =
            document.querySelector('#monitorar-atual .nome-grande');

        const monitorAnterior =
            document.querySelector('#monitorar-anterior .nome');

        if (monitorAtual) {
            monitorAtual.innerText = nomeAtual;
        }

        if (monitorAnterior) {
            monitorAnterior.innerText = nomeAnterior;
        }

        // =========================
        // ABA SORTEIO
        // =========================

        // CONTEMPLADO

        const contempladoNome =
            document.querySelector('#contemplado .nome-grande');

        const contempladoData =
            document.querySelector('#contemplado .horario-grande');

        const contempladoCliente =
            document.getElementById('cliente');

        if (contempladoNome) {
            contempladoNome.innerText = nomeAtual;
        }

        if (contempladoData) {
            contempladoData.innerText = dataAtual;
        }

        if (contempladoCliente) {
            contempladoCliente.innerText = clienteAtual;
        }

        // ANTERIOR

        const anteriorNome =
            document.querySelector('#anterior .nome');

        const anteriorData =
            document.querySelector('#anterior .horario');

        const anteriorCliente =
            document.querySelector('#anterior .cliente');

        if (anteriorNome) {
            anteriorNome.innerText = nomeAnterior;
        }

        if (anteriorData) {
            anteriorData.innerText = dataAnterior;
        }

        if (anteriorCliente) {
            anteriorCliente.innerText = clienteAnterior;
        }

        // POSTERIOR
        // Mantido vazio por enquanto

        const posteriorNome =
            document.querySelector('#posterior .nome');

        const posteriorData =
            document.querySelector('#posterior .horario');

        const posteriorCliente =
            document.querySelector('#posterior .cliente');

        if (posteriorNome) {
            posteriorNome.innerText = "--";
        }

        if (posteriorData) {
            posteriorData.innerText = "--";
        }

        if (posteriorCliente) {
            posteriorCliente.innerText = "--";
        }

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

// =========================
// TROCAR DE TELA
// =========================

function trocarModo(modo) {

    const dashboard =
        document.getElementById('dashboard-container');

    const sorteio =
        document.getElementById('sorteio-container');

    if (modo === 'sorteio') {

        dashboard.style.display = 'none';

        sorteio.style.display = 'flex';

        sorteio.classList.add('ativo');

    } else {

        dashboard.style.display = 'flex';

        sorteio.style.display = 'none';

        sorteio.classList.remove('ativo');
    }
}

// =========================
// RELÓGIO
// =========================

function atualizarRelogio() {

    const agora = new Date();

    document.getElementById('clock').innerText =
        agora.toLocaleTimeString('pt-BR');
}

// =========================
// INICIALIZAÇÃO
// =========================

atualizarRelogio();
atualizarDados();

setInterval(atualizarRelogio, 1000);
setInterval(atualizarDados, 30000);
