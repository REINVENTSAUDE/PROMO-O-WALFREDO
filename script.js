// LINK DO CSV PUBLICADO
const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// Função para buscar e processar os dados
async function atualizarDados() {
    try {
        const resposta = await fetch(URL_CSV);
        const csvText = await resposta.text();

        // Limpa linhas vazias
        const linhas = csvText
            .trim()
            .split('\n')
            .filter(linha => linha.trim() !== "");

        // Último registro
        const ultimaLinha = linhas[linhas.length - 1]
            ? linhas[linhas.length - 1].split(',')
            : ["--", "--", "--"];

        // Penúltimo registro
        const penultimaLinha = linhas[linhas.length - 2]
            ? linhas[linhas.length - 2].split(',')
            : ["--", "--", "--"];

        // Próximo registro (se existir)
        const posteriorLinha = linhas[linhas.length]
            ? linhas[linhas.length].split(',')
            : ["--", "--", "--"];

        // =========================
        // ABA SORTEIO
        // =========================

        // CONTEMPLADO
        document.querySelector('#contemplado .nome-grande').innerText =
            ultimaLinha[0] || "--";

        document.querySelector('#contemplado .horario-grande').innerText =
            ultimaLinha[1] || "--";

        document.getElementById('cliente').innerText =
            ultimaLinha[2] || "--";

        // ANTERIOR
        document.querySelector('#anterior .nome').innerText =
            penultimaLinha[0] || "--";

        document.querySelector('#anterior .horario').innerText =
            penultimaLinha[1] || "--";

        const clienteAnterior = document.querySelector('#anterior .cliente');
        if (clienteAnterior) {
            clienteAnterior.innerText = penultimaLinha[2] || "--";
        }

        // POSTERIOR
        document.querySelector('#posterior .nome').innerText =
            posteriorLinha[0] || "--";

        document.querySelector('#posterior .horario').innerText =
            posteriorLinha[1] || "--";

        const clientePosterior = document.querySelector('#posterior .cliente');
        if (clientePosterior) {
            clientePosterior.innerText = posteriorLinha[2] || "--";
        }

        // =========================
        // ABA MONITORAR
        // =========================

        document.querySelector('#monitorar-atual .nome-grande').innerText =
            ultimaLinha[0] || "--";

        document.querySelector('#monitorar-anterior .nome').innerText =
            penultimaLinha[0] || "--";

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

// Troca de telas
function trocarModo(modo) {
    const dash = document.getElementById('dashboard-container');
    const sort = document.getElementById('sorteio-container');

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

// Relógio
function atualizarRelogio() {
    const agora = new Date();

    document.getElementById('clock').innerText =
        agora.toLocaleTimeString('pt-BR');
}

// Inicialização
setInterval(atualizarRelogio, 1000);
setInterval(atualizarDados, 30000);

atualizarRelogio();
atualizarDados();
