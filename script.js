const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// ========================
// MONITORAR
// ========================
async function atualizarMonitorar() {
    try {
        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();
        const linhas = csvText.trim().split('\n').filter(l => l.trim() !== '');
        const dados = linhas.slice(1).map(l => l.split(','));

        if (dados.length === 0) return;

        const ultimaLinha = dados[dados.length - 1];
        const penultimaLinha = dados[dados.length - 2] || [];

        document.querySelector('#monitorar-atual .nome-grande').innerText = ultimaLinha[1] || "--";
        document.querySelector('#monitorar-anterior .nome').innerText = penultimaLinha[1] || "--";

        // Rodapé (apenas se existirem no HTML)
        const total = document.getElementById('total-registros');
        if (total) total.innerText = dados.length;
        const atualizacao = document.getElementById('ultima-atualizacao');
        if (atualizacao) atualizacao.innerText = new Date().toLocaleTimeString('pt-BR');

    } catch (erro) {
        console.error("Erro no Monitorar:", erro);
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
        const linhas = csvText.trim().split('\n').filter(l => l.trim() !== '');
        const dados = linhas.slice(1).map(l => l.split(','));

        const partes = dataPesquisa.split('-');
        const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

        // Filtra registros que são do mesmo dia E hora menor ou igual ao pesquisado
        const registrosValidos = dados.filter(linha => {
            return linha[2] === dataFormatada && linha[3] <= horaPesquisa;
        });

        if (registrosValidos.length === 0) {
            alert("Nenhum registro encontrado para este horário ou anterior.");
            return;
        }

        // Ordena para pegar o último ocorrido (o mais próximo do horário)
        registrosValidos.sort((a, b) => b[3].localeCompare(a[3]));
        const contemplado = registrosValidos[0];

        // Encontra o índice real para pegar anterior e posterior
        const indiceReal = dados.findIndex(d => d === contemplado);
        const anterior = indiceReal > 0 ? dados[indiceReal - 1] : null;
        const posterior = indiceReal < dados.length - 1 ? dados[indiceReal + 1] : null;

        // Atualiza UI
        document.querySelector('#contemplado .nome-grande').innerText = contemplado[1] || "--";
        document.querySelector('#contemplado .horario-grande').innerText = contemplado[3] || "--";
        document.getElementById('cliente').innerText = contemplado[4] || "--";

        const atualizarPainel = (id, obj) => {
            const el = document.querySelector(id);
            if(el) {
                el.querySelector('.nome').innerText = obj ? obj[1] : "--";
                el.querySelector('.horario').innerText = obj ? obj[3] : "--";
                const cl = el.querySelector('.cliente');
                if(cl) cl.innerText = obj ? obj[4] : "--";
            }
        };

        atualizarPainel('#anterior', anterior);
        atualizarPainel('#posterior', posterior);

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar dados.");
    }
}

// ... (o restante das funções trocarModo, atualizarRelogio e inicialização permanecem iguais)
