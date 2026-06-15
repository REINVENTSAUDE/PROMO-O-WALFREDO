const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// --- Monitorar ---
async function atualizarMonitorar() {
    try {
        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();
        const linhas = csvText.trim().split('\n').filter(l => l.trim() !== '');
        if (linhas.length <= 1) return;
        
        const dados = linhas.slice(1).map(l => l.split(','));
        const ultimaLinha = dados[dados.length - 1];
        const penultimaLinha = dados[dados.length - 2] || [];

        const elAtual = document.querySelector('#monitorar-atual .nome-grande');
        const elAnterior = document.querySelector('#monitorar-anterior .nome');
        
        if (elAtual) elAtual.innerText = ultimaLinha[1] || "--";
        if (elAnterior) elAnterior.innerText = penultimaLinha[1] || "--";

    } catch (erro) { console.error("Erro Monitorar:", erro); }
}

// --- Sorteio ---
async function buscarSorteio() {
    const dataInput = document.getElementById('input-data').value;
    const horaInput = document.getElementById('input-hora').value;

    if (!dataInput || !horaInput) { alert("Informe data e hora."); return; }

    try {
        const resposta = await fetch(URL_CSV + "&t=" + Date.now());
        const csvText = await resposta.text();
        const dados = csvText.trim().split('\n').slice(1).map(l => l.split(','));

        const partes = dataInput.split('-');
        const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

        // Filtra e ordena
        const encontrados = dados.filter(d => d[2] === dataFormatada && d[3] <= horaInput);
        if (encontrados.length === 0) { alert("Nenhum registro encontrado."); return; }

        encontrados.sort((a, b) => b[3].localeCompare(a[3]));
        const contemplado = encontrados[0];
        
        // Atualiza campos (Adicionado validação para não quebrar)
        const setText = (sel, val) => { const el = document.querySelector(sel); if (el) el.innerText = val || "--"; };
        
        setText('#contemplado .nome-grande', contemplado[1]);
        setText('#contemplado .horario-grande', contemplado[3]);
        setText('#cliente', contemplado[4]);

    } catch (erro) { console.error("Erro Sorteio:", erro); alert("Erro ao buscar."); }
}

// --- Funções Auxiliares ---
function trocarModo(modo) {
    const dash = document.getElementById('dashboard-container');
    const sort = document.getElementById('sorteio-container');
    if (!dash || !sort) return;
    
    if (modo === 'sorteio') {
        dash.style.display = 'none';
        sort.style.display = 'flex';
    } else {
        dash.style.display = 'flex';
        sort.style.display = 'none';
    }
}

function atualizarRelogio() {
    const el = document.getElementById('clock');
    if (el) el.innerText = new Date().toLocaleTimeString('pt-BR');
}

// Inicialização
atualizarMonitorar();
atualizarRelogio();
setInterval(atualizarMonitorar, 30000);
setInterval(atualizarRelogio, 1000);
