
// Selecionando os elementos da página
const btnEntrada = document.getElementById("btnEntrada");
const btnSaida = document.getElementById("btnSaida");

const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("tituloFormulario");

const btnCancelar = document.getElementById("btnCancelar");
const formMovimentacao = document.getElementById("formMovimentacao");

// Campos do formulário
const descricao = document.getElementById("descricao");
const valor = document.getElementById("valor");
const categoria = document.getElementById("categoria");

// Lista temporária de movimentações
let movimentacoes = [];

// Tipo da movimentação selecionada
let tipoMovimentacao = "";

// Função para abrir o formulário
function abrirFormulario(tipo) {

    formulario.style.display = "block";

    tipoMovimentacao = tipo;

    if (tipo === "entrada") {
        tituloFormulario.textContent = "Adicionar entrada";
    } else {
        tituloFormulario.textContent = "Adicionar saída";
    }
}

// Botão de entrada
btnEntrada.addEventListener("click", function() {
    abrirFormulario("entrada");
});

// Botão de saída
btnSaida.addEventListener("click", function() {
    abrirFormulario("saida");
});

// Botão cancelar
btnCancelar.addEventListener("click", function() {
    formulario.style.display = "none";
});

// Salvar movimentação
formMovimentacao.addEventListener("submit", function(event) {

    event.preventDefault();

    const novaMovimentacao = {
        descricao: descricao.value,
        valor: Number(valor.value),
        categoria: categoria.value,
        tipo: tipoMovimentacao
    };

    movimentacoes.push(novaMovimentacao);

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
    grafico.replaceChildren();

    for (const [nome, valor] of categorias) {
        const percentual = (valor / totalGasto) * 100;
        const linha = document.createElement("div");
        linha.className = "mb-3";

        const rotulo = document.createElement("p");
        rotulo.className = "mb-1";
        rotulo.textContent = nome + " · " + formatoReais.format(valor);

        const trilho = document.createElement("div");
        trilho.className = "progress";
        trilho.setAttribute("aria-hidden", "true");

        const barra = document.createElement("div");
        barra.className = "progress-bar";
        barra.style.width = percentual + "%";

        trilho.appendChild(barra);
        linha.append(rotulo, trilho);
        grafico.appendChild(linha);
    }
}
