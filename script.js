

const btnEntrada = document.getElementById("btnEntrada");
const btnSaida = document.getElementById("btnSaida");

const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("tituloFormulario");

const btnCancelar = document.getElementById("btnCancelar");
const formMovimentacao = document.getElementById("formMovimentacao");


const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const categoria = document.getElementById("categoria");


let movimentacoes = [];


let tipoMovimentacao = "";


function abrirFormulario(tipo) {

    formulario.style.display = "block";

    tipoMovimentacao = tipo;

    if (tipo === "entrada") {
        tituloFormulario.textContent = "Adicionar entrada";
    } else {
        tituloFormulario.textContent = "Adicionar saída";
    }
}


btnEntrada.addEventListener("click", function() {
    abrirFormulario("entrada");
});


btnSaida.addEventListener("click", function() {
    abrirFormulario("saida");
});


btnCancelar.addEventListener("click", function() {
    formulario.style.display = "none";
});


formMovimentacao.addEventListener("submit", function(event) {

    event.preventDefault();

    const novaMovimentacao = {
        descricao: descricao.value,
        valor: Number(valor.value),
        categoria: categoria.value,
        tipo: tipoMovimentacao
    };

    movimentacoes.push(novaMovimentacao);

    atualizarResumo();
    atualizarHistorico();
    atualizarGraficoGastos();

    console.log(movimentacoes);

    alert("Movimentação cadastrada com sucesso!");

    formMovimentacao.reset();

    formulario.style.display = "none";


function atualizarHistorico() {

    const lista = document.getElementById("listaMovimentacoes");

    lista.innerHTML = "";

    for (let i = 0; i < movimentacoes.length; i++) {

        const movimento = movimentacoes[i];

        const item = document.createElement("div");
        item.className = "transacao";

        let sinal = "+";
        let classe = "valor-entrada";

        if (movimento.tipo === "saida") {
            sinal = "-";
            classe = "valor-saida";
        }

        item.innerHTML = `
            <div>
                <p><strong>${movimento.descricao}</strong></p>
                <p>${movimento.categoria}</p>
            </div>

            <p class="${classe}">
                ${sinal} R$ ${movimento.valor.toFixed(2).replace(".", ",")}
            </p>
        `;

        lista.appendChild(item);
    }
}


});

const formatoReais = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
});

function atualizarResumo() {
    let entradasEmCentavos = 0;
    let saidasEmCentavos = 0;

    for (const movimento of movimentacoes) {
        const valorEmCentavos = Math.round(movimento.valor * 100);
        if (movimento.tipo === "entrada") {
            entradasEmCentavos += valorEmCentavos;
        } else if (movimento.tipo === "saida") {
            saidasEmCentavos += valorEmCentavos;
        }
    }

    const saldo = (entradasEmCentavos - saidasEmCentavos) / 100;
    document.getElementById("saldoDisponivel").textContent = formatoReais.format(saldo);
    document.getElementById("totalEntradas").textContent = formatoReais.format(entradasEmCentavos / 100);
    document.getElementById("totalSaidas").textContent = formatoReais.format(saidasEmCentavos / 100);
}

const formatoPercentual = new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1
});

const coresDoGrafico = [
    "#175bb5", "#a82b41", "#17734a", "#9b5100", "#6535a3", "#00707e"
];

function atualizarGraficoGastos() {
    const totais = new Map();

    for (const movimento of movimentacoes) {
        if (movimento.tipo === "saida") {
            const total = totais.get(movimento.categoria) ?? 0;
            totais.set(movimento.categoria, total + movimento.valor);
        }
    }

    if (totais.size === 0) {
        return;
    }

    const categorias = [...totais].sort((a, b) => b[1] - a[1]);
    const totalGasto = categorias.reduce((soma, [, valor]) => soma + valor, 0);
    const grafico = document.getElementById("graficoGastos");

    const pizza = document.createElement("div");
    pizza.className = "grafico-pizza";
    pizza.setAttribute("aria-hidden", "true");

    const legenda = document.createElement("ul");
    legenda.className = "legenda-gastos mb-0";

    const fatias = [];
    let valorAcumulado = 0;

    categorias.forEach(([nome, valor], indice) => {
        const cor = coresDoGrafico[indice];
        const inicio = (valorAcumulado / totalGasto) * 100;
        valorAcumulado += valor;
        const fim = (valorAcumulado / totalGasto) * 100;
        fatias.push(`${cor} ${inicio}% ${fim}%`);

        const item = document.createElement("li");
        item.style.setProperty("--cor-fatia", cor);

        const rotulo = document.createElement("strong");
        rotulo.textContent = nome;

        const detalhes = document.createElement("span");
        const percentual = formatoPercentual.format(valor / totalGasto);
        detalhes.textContent = `${formatoReais.format(valor)} · ${percentual} dos gastos`;

        item.append(rotulo, detalhes);
        legenda.appendChild(item);
    });

    pizza.style.backgroundImage = `conic-gradient(${fatias.join(", ")})`;
    grafico.replaceChildren(pizza, legenda);
}

const btnTema = document.getElementById("btnTema");

btnTema.addEventListener("click", function () {
    const pagina = document.documentElement;
    const modoEscuroAtivo = pagina.getAttribute("data-bs-theme") === "dark";
    const novoTema = modoEscuroAtivo ? "light" : "dark";

    pagina.setAttribute("data-bs-theme", novoTema);
    btnTema.textContent = novoTema === "dark" ? "Modo claro" : "Modo escuro";
});
