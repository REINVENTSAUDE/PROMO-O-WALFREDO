const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// ========================
// MONITORAR
// ========================

async function atualizarMonitorar() {
    try {

        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();

        const linhas = csvText
            .trim()
            .split('\n')
            .filter(l => l.trim() !== '');

        const dados = linhas.slice(1);

        if (dados.length === 0) return;

        const ultimaLinha = dados[dados.length - 1].split(',');
        const penultimaLinha = dados[dados.length - 2]
            ? dados[dados.length - 2].split(',')
            : ["--","--","--","--"];

        document.querySelector('#monitorar-atual .nome-grande').innerText =
            ultimaLinha[0] || "--";

        document.querySelector('#monitorar-anterior .nome').innerText =
            penultimaLinha[0] || "--";

    } catch (erro) {
        console.error("Erro:", erro);
    }
}

// ========================
// SORTEIO
// ========================

async function buscarSorteio() {

    const dataPesquisa = document.getElementById('input-data').value;
    const horaPesquisa = document.getElementById('input-hora').value;

    if (!dataPesquisa || !horaPesquisa) {
        alert("Informe data e hora.");
        return;
    }

    try {

        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();

        const linhas = csvText
            .trim()
            .split('\n')
            .filter(l => l.trim() !== '');

        const dados = linhas.slice(1).map(l => l.split(','));

        // yyyy-mm-dd -> dd/mm/yyyy
        const partes = dataPesquisa.split('-');

        const dataFormatada =
            `${partes[2]}/${partes[1]}/${partes[0]}`;

        let indiceContemplado = -1;

        for (let i = 0; i < dados.length; i++) {

            const dataLinha = dados[i][1];
            const horaLinha = dados[i][2];

            if (
                dataLinha === dataFormatada &&
                horaLinha <= horaPesquisa
            ) {
                indiceContemplado = i;
            }
        }

        if (indiceContemplado === -1) {

            alert("Nenhum registro encontrado.");

            return;
        }

        const contemplado = dados[indiceContemplado];

        const anterior =
            indiceContemplado > 0
                ? dados[indiceContemplado - 1]
                : null;

        const posterior =
            indiceContemplado < dados.length - 1
                ? dados[indiceContemplado + 1]
                : null;

        // ===================
        // CONTEMPLADO
        // ===================

        document.querySelector(
            '#contemplado .nome-grande'
        ).innerText = contemplado[0];

        document.querySelector(
            '#contemplado .horario-grande'
        ).innerText = `${contemplado[1]} ${contemplado[2]}`;

        document.getElementById(
            'cliente'
        ).innerText = contemplado[3];

        // ===================
        // ANTERIOR
        // ===================

        document.querySelector(
            '#anterior .nome'
        ).innerText =
            anterior ? anterior[0] : "--";

        document.querySelector(
            '#anterior .horario'
        ).innerText =
            anterior
                ? `${anterior[1]} ${anterior[2]}`
                : "--";

        document.querySelector(
            '#anterior .cliente'
        ).innerText =
            anterior ? anterior[3] : "--";

        // ===================
        // POSTERIOR
        // ===================

        document.querySelector(
            '#posterior .nome'
        ).innerText =
            posterior ? posterior[0] : "--";

        document.querySelector(
            '#posterior .horario'
        ).innerText =
            posterior
                ? `${posterior[1]} ${posterior[2]}`
                : "--";

        document.querySelector(
            '#posterior .cliente'
        ).innerText =
            posterior ? posterior[3] : "--";

    } catch (erro) {

        console.error(erro);

        alert("Erro ao buscar dados.");
    }
}

// ========================
// TROCAR TELAS
// ========================

function trocarModo(modo) {

    const dash =
        document.getElementById('dashboard-container');

    const sort =
        document.getElementById('sorteio-container');

    if (modo === 'sorteio') {

        dash.style.display = 'none';

        sort.style.display = 'flex';

        sort.classList.add('ativo');

    } else {

        dash.style.display = 'flex';

        sort.style.display = 'none';

        sort.classList.remove('ativo');
    }
}

// ========================
// RELÓGIO
// ========================

function atualizarRelogio() {

    const agora = new Date();

    document.getElementById('clock').innerText =
        agora.toLocaleTimeString('pt-BR');
}

// ========================
// INICIALIZAÇÃO
// ========================

atualizarMonitorar();
atualizarRelogio();

setInterval(atualizarMonitorar, 30000);
setInterval(atualizarRelogio, 1000);
