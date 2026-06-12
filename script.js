// LINK DO CSV PUBLICADO (Substitua pelo seu link da planilha)
const URL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS88kNt-4n-CG_qsh1rl-G6DrZwJdFQNQ58711RlaDHNGympfu0m4GgJhUQv8PlrWx92yrudimbdu96/pub?gid=2072951796&single=true&output=csv";

// Função para buscar e processar os dados
async function atualizarDados() {
    try {
        const resposta = await fetch(URL_CSV);
        const csvText = await resposta.text();
        
        // Limpa linhas vazias e transforma em array
        const linhas = csvText.trim().split('\n')
                              .filter(linha => linha.trim() !== "");
        
        // Pega o último registro (o mais recente)
        const ultimaLinha = linhas[linhas.length - 1].split(',');
        // Pega o penúltimo (o anterior)
        const penultimaLinha = linhas[linhas.length - 2] ? linhas[linhas.length - 2].split(',') : ["--", "--"];

        // ATUALIZAÇÃO PARA SORTEIO
        // Contemplado
        document.querySelector('#contemplado .nome-grande').innerText = ultimaLinha[0];
        document.querySelector('#contemplado .horario-grande').innerText = ultimaLinha[1];
        document.getElementById('cliente').innerText = ultimaLinha[2] || "--";
        
        // Anterior
        document.querySelector('#anterior .nome').innerText = penultimaLinha[0];
        document.querySelector('#anterior .horario').innerText = penultimaLinha[1];

        // ATUALIZAÇÃO PARA MONITORAR (Aba 1)
        document.getElementById('monitorar-nome').innerText = ultimaLinha[0];
        document.getElementById('monitorar-anterior-nome').innerText = penultimaLinha[0];

    } catch (erro) {
        console.error("Erro ao buscar dados:", erro);
    }
}

// Função de trocar modo
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

// Relógio do cabeçalho
function atualizarRelogio() {
    const agora = new Date();
    document.getElementById('clock').innerText = agora.toLocaleTimeString('pt-BR');
}

// Inicialização
setInterval(atualizarRelogio, 1000);
// Atualiza dados automaticamente a cada 30 segundos
setInterval(atualizarDados, 30000);
atualizarDados(); // Primeira carga
