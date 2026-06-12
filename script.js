const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";
let modoAtual = 'dashboard'; // 'dashboard' ou 'sorteio'

// 1. Relógio e Timer de Atualização
setInterval(() => {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString();
}, 1000);

setInterval(atualizarDados, 30000);

async function atualizarDados() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        const linhas = data.split('\n').slice(1);

        const registros = linhas.map(linha => {
            const [ts, nome, data, hora, cliente] = linha.split(',');
            if (!nome || !data || !hora) return null;
            return {
                nome: nome.trim(),
                data: data.trim(),
                hora: hora.trim(),
                cliente: cliente ? cliente.trim() : "",
                dataSort: parseInt(data.split('/').reverse().join('')),
                min: converterParaMinutos(hora.trim())
            };
        }).filter(r => r !== null);

        // ORDENAÇÃO GLOBAL (Data + Horário)
        registros.sort((a, b) => a.dataSort - b.dataSort || a.min - b.min);

        renderizar(registros);
    } catch (e) { console.error("Erro ao buscar dados", e); }
}

function renderizar(registros) {
    if (modoAtual === 'dashboard') {
        // Exibe o último como destaque e os anteriores como lista
        const ultimo = registros[registros.length - 1];
        document.getElementById('dashboard-container').innerHTML = `
            <div class="destaque-maior fade-in">
                <h1>ÚLTIMO REGISTRO: ${ultimo.nome}</h1>
                <p>${ultimo.hora} - ${ultimo.cliente}</p>
            </div>
        `;
    } else {
        // Lógica de Sorteio (Anterior / Contemplado / Posterior)
        const dataBusca = document.getElementById('input-data').value.split('-').reverse().join('/');
        const horaBusca = document.getElementById('input-hora').value;
        const sorteioMin = converterParaMinutos(horaBusca);
        
        const registrosDoDia = registros.filter(r => r.data === dataBusca);
        let idx = -1;
        for (let i = 0; i < registrosDoDia.length; i++) {
            if (registrosDoDia[i].min <= sorteioMin) idx = i;
        }

        renderizarSorteio(
            registrosDoDia[idx - 1] || { nome: "---", hora: "--:--" },
            registrosDoDia[idx] || { nome: "SEM DADOS", hora: "--:--", cliente: "---" },
            registrosDoDia[idx + 1] || { nome: "---", hora: "--:--" }
        );
    }
}

function converterParaMinutos(hStr) {
    const [h, m] = hStr.split(':').map(Number);
    return (h * 60) + m;
}

// Alternar Modos
function trocarModo(modo) {
    modoAtual = modo;
    document.getElementById('dashboard-container').style.display = modo === 'dashboard' ? 'block' : 'none';
    document.getElementById('sorteio-container').style.display = modo === 'sorteio' ? 'flex' : 'none';
    atualizarDados();
}
function trocarModo(modo) {
    const dash = document.getElementById('dashboard-container');
    const sort = document.getElementById('sorteio-container');

    if (modo === 'sorteio') {
        dash.style.display = 'none';
        sort.style.display = 'flex'; // Garante que é flex
        sort.classList.add('ativo');  // Ativa a exibição da busca
    } else {
        dash.style.display = 'flex';
        sort.style.display = 'none';
        sort.classList.remove('ativo'); // Esconde a busca
    }
}
// Inicialização
atualizarDados();
