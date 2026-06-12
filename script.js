// CONFIGURAÇÕES
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/185Mx4xA3mzKf9c2ni7DsWLx5SQk6luuxgzQxcRdhs34/edit?usp=sharing"; // Substitua pela URL gerada pelo Google Sheets
const DATA_SORTEIO = "11/06/2026"; // Data do dia do sorteio
const HORARIO_SORTEIO = "10:15";   // Horário limite do sorteio

// Inicialização
function init() {
    atualizarPainel(); // Busca inicial
    setInterval(atualizarPainel, 30000); // Atualiza a cada 30 segundos
    
    // Relógio do topo
    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

async function atualizarPainel() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const linhas = csvText.split('\n').slice(1); // Ignora cabeçalho

        const registros = linhas.map(linha => {
            const [ts, nome, data, hora, cliente] = linha.split(',');
            if (!nome || !hora) return null;
            return { nome: nome.trim(), data: data.trim(), hora: hora.trim(), cliente: cliente ? cliente.trim() : "", min: converterParaMinutos(hora.trim()) };
        }).filter(r => r !== null && r.data === DATA_SORTEIO);

        // Ordena por horário
        registros.sort((a, b) => a.min - b.min);

        // Lógica do Contemplado (último <= horário sorteado)
        const sorteioMin = converterParaMinutos(HORARIO_SORTEIO);
        let idx = -1;
        for (let i = 0; i < registros.length; i++) {
            if (registros[i].min <= sorteioMin) idx = i;
            else break;
        }

        renderizar(
            registros[idx - 1] || { nome: "---", hora: "--:--" },
            registros[idx] || { nome: "AGUARDANDO", hora: "--:--", cliente: "---" },
            registros[idx + 1] || { nome: "---", hora: "--:--" }
        );

    } catch (e) {
        console.error("Erro ao buscar dados:", e);
    }
}

function renderizar(ant, cont, post) {
    // Painel Anterior
    document.querySelector('#anterior .nome').innerText = ant.nome;
    document.querySelector('#anterior .horario').innerText = ant.hora;

    // Painel Central (Contemplado)
    document.querySelector('.central .nome-grande').innerText = cont.nome;
    document.querySelector('.central .horario-grande').innerText = cont.hora;
    document.getElementById('cliente').innerText = cont.cliente;
    document.getElementById('data-consulta').innerText = DATA_SORTEIO;

    // Painel Posterior
    document.querySelector('#posterior .nome').innerText = post.nome;
    document.querySelector('#posterior .horario').innerText = post.hora;
}

function converterParaMinutos(horaString) {
    const [h, m] = horaString.split(':').map(Number);
    return (h * 60) + m;
}

// Iniciar sistema
init();
