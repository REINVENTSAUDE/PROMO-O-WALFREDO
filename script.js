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

        const total = document.getElementById('total-registros');
        if (total) total.innerText = dados.length;
        const atualizacao = document.getElementById('ultima-atualizacao');
        if (atualizacao) atualizacao.innerText = new Date().toLocaleTimeString('pt-BR');

    } catch (erro) { console.error("Erro:", erro); }
}

// ========================
// SORTEIO (LÓGICA CORRIGIDA)
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

        // Filtra registros que batem a data E hora menor ou igual
        // .trim() remove espaços invisíveis que causam erros de comparação
        const candidatos = dados.filter(d => 
            d[2].trim() === dataFormatada && d[3].trim() <= horaPesquisa
        );

        if (candidatos.length === 0) {
            alert("Nenhum registro encontrado até este horário.");
            return;
        }

        // Ordena por horário (do maior para o menor) para pegar o mais recente
        candidatos.sort((a, b) => b[3].localeCompare(a[3]));
        const contemplado = candidatos[0];

        // Encontra a posição do contemplado no array original para pegar anterior/posterior
        const idx = dados.findIndex(d => d[2] === contemplado[2] && d[3] === contemplado[3] && d[1] === contemplado[1]);
        const anterior = idx > 0 ? dados[idx - 1] : null;
        const posterior = idx < dados.length - 1 ? dados[idx + 1] : null;

        // Atualização dos campos (Adicionei o .trim() nos dados para evitar erros)
        document.querySelector('#contemplado .nome-grande').innerText = contemplado[1] || "--";
        document.querySelector('#contemplado .horario-grande').innerText = contemplado[3] || "--";
        document.getElementById('cliente').innerText = contemplado[4] || "--";

        // Funções auxiliares para evitar erro caso o elemento não exista
        const setEl = (id, val) => { const el = document.querySelector(id); if(el) el.innerText = val || "--"; };
        
        setEl('#anterior .nome', anterior ? anterior[1] : "--");
        setEl('#anterior .horario', anterior ? anterior[3] : "--");
        setEl('#anterior .cliente', anterior ? anterior[4] : "--");

        setEl('#posterior .nome', posterior ? posterior[1] : "--");
        setEl('#posterior .horario', posterior ? posterior[3] : "--");
        setEl('#posterior .cliente', posterior ? posterior[4] : "--");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao buscar dados.");
    }
}

// ... manter as funções trocarModo, atualizarRelogio e inicialização como estavam
