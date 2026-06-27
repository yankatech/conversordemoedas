// 1. Selecionar os elementos do HTML
const inputValor = document.getElementById('valor');
const selectMoeda = document.getElementById('moeda-destino');
const btnConverter = document.getElementById('btn-converter');
const divResultado = document.getElementById('resultado');

// URL base da API de cotações
const urlAPI = "https://economia.awesomeapi.com.br/last/";

// 2. Função assíncrona para buscar os dados e converter
async function converterMoeda() {
    const valorEmReal = parseFloat(inputValor.value);
    const moedaSelecionada = selectMoeda.value;

    // Validação simples do input
    if (isNaN(valorEmReal) || valorEmReal <= 0) {
        alert("Por favor, insira um valor válido maior que zero!");
        return;
    }

    divResultado.innerText = "Carregando cotação...";

    try {
        // Faz a requisição para a API combinando a moeda desejada com o Real (BRL)
        const resposta = await fetch(`${urlAPI}${moedaSelecionada}-BRL`);
        
        if (!resposta.ok) {
            throw new Error("Não foi possível obter as cotações.");
        }

        const dados = await resposta.json();
        
        // A API retorna um objeto dinâmico baseado na moeda. Ex: dados.USDBRL
        const chaveMoeda = `${moedaSelecionada}BRL`;
        const taxaDeCambio = parseFloat(dados[chaveMoeda].bid);

        // Calcula o valor convertido (R$ dividido pela taxa da moeda estrangeira)
        const valorConvertido = valorEmReal / taxaDeCambio;

        // Formata a exibição final baseado na moeda escolhida
        let valorFormatado;
        if (moedaSelecionada === 'BTC') {
            valorFormatado = valorConvertido.toFixed(5) + " BTC";
        } else {
            valorFormatado = valorConvertido.toLocaleString('en-US', { 
                style: 'currency', 
                currency: moedaSelecionada 
            });
        }

        // Mostra o resultado na tela
        divResultado.innerHTML = `<strong>${valorFormatado}</strong>`;

    } catch (erro) {
        console.error(erro);
        divResultado.innerText = "Erro ao buscar cotação. Tente novamente.";
    }
}

// 3. Escutar o clique do botão
btnConverter.addEventListener('click', converterMoeda);

// Também permite converter ao apertar "Enter" no campo de valor
inputValor.addEventListener('keypress', function(evento) {
    if (evento.key === 'Enter') {
        converterMoeda();
    }
});