// Elementos do DOM
const elements = {
    // Filamento
    pesoPeca: document.getElementById('pesoPeca'),
    precoKilo: document.getElementById('precoKilo'),
    custoFilamento: document.getElementById('custoFilamento'),

    // Suportes
    usaSuporte: document.getElementById('usaSuporte'),
    suporteContent: document.getElementById('suporteContent'),
    pesoSuporte: document.getElementById('pesoSuporte'),
    custoSuporte: document.getElementById('custoSuporte'),

    // Tempo e Energia
    tempoHoras: document.getElementById('tempoHoras'),
    tempoMinutos: document.getElementById('tempoMinutos'),
    potenciaImpressora: document.getElementById('potenciaImpressora'),
    precoKwh: document.getElementById('precoKwh'),
    custoEnergia: document.getElementById('custoEnergia'),

    // Pintura
    usaPintura: document.getElementById('usaPintura'),
    pinturaContent: document.getElementById('pinturaContent'),
    tamanhoPeca: document.getElementById('tamanhoPeca'),
    custoPinturaCustom: document.getElementById('custoPinturaCustom'),
    custoPintura: document.getElementById('custoPintura'),

    // Lucro e Preço
    margemLucro: document.getElementById('margemLucro'),
    precoCustom: document.getElementById('precoCustom'),

    // Resultado
    custoTotal: document.getElementById('custoTotal'),
    lucroValor: document.getElementById('lucroValor'),
    precoVenda: document.getElementById('precoVenda'),
    margemReal: document.getElementById('margemReal'),

    // Projeção
    vendasMes: document.getElementById('vendasMes'),
    vendasMesValor: document.getElementById('vendasMesValor'),
    faturamentoMensal: document.getElementById('faturamentoMensal'),
    lucroMensal: document.getElementById('lucroMensal')
};

// Botões de margem
const marginBtns = document.querySelectorAll('.margin-btn');

// Estado da calculadora
let estado = {
    custoFilamento: 0,
    custoSuporte: 0,
    custoEnergia: 0,
    custoPintura: 0,
    custoTotal: 0,
    lucro: 0,
    precoVenda: 0,
    margemReal: 0
};

// Formatar moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

// Obter valor numérico do input
function getValor(elemento) {
    return parseFloat(elemento.value) || 0;
}

// Calcular custo do filamento
function calcularCustoFilamento() {
    const peso = getValor(elements.pesoPeca);
    const precoKilo = getValor(elements.precoKilo);

    // Preço por grama = preço do kilo / 1000
    estado.custoFilamento = (peso * precoKilo) / 1000;
    elements.custoFilamento.textContent = formatarMoeda(estado.custoFilamento);
}

// Calcular custo dos suportes
function calcularCustoSuporte() {
    if (!elements.usaSuporte.checked) {
        estado.custoSuporte = 0;
        elements.custoSuporte.textContent = formatarMoeda(0);
        return;
    }

    const peso = getValor(elements.pesoSuporte);
    const precoKilo = getValor(elements.precoKilo);

    estado.custoSuporte = (peso * precoKilo) / 1000;
    elements.custoSuporte.textContent = formatarMoeda(estado.custoSuporte);
}

// Calcular custo de energia
function calcularCustoEnergia() {
    const horas = getValor(elements.tempoHoras);
    const minutos = getValor(elements.tempoMinutos);
    const potencia = getValor(elements.potenciaImpressora);
    const precoKwh = getValor(elements.precoKwh);

    // Tempo total em horas
    const tempoTotal = horas + (minutos / 60);

    // Consumo em kWh = (Potência em W / 1000) * Tempo em horas
    const consumoKwh = (potencia / 1000) * tempoTotal;

    estado.custoEnergia = consumoKwh * precoKwh;
    elements.custoEnergia.textContent = formatarMoeda(estado.custoEnergia);
}

// Calcular custo de pintura
function calcularCustoPintura() {
    if (!elements.usaPintura.checked) {
        estado.custoPintura = 0;
        elements.custoPintura.textContent = formatarMoeda(0);
        return;
    }

    const custoCustom = getValor(elements.custoPinturaCustom);

    if (custoCustom > 0) {
        estado.custoPintura = custoCustom;
    } else {
        estado.custoPintura = parseFloat(elements.tamanhoPeca.value) || 0;
    }

    elements.custoPintura.textContent = formatarMoeda(estado.custoPintura);
}

// Calcular custo total
function calcularCustoTotal() {
    estado.custoTotal = estado.custoFilamento + estado.custoSuporte +
                        estado.custoEnergia + estado.custoPintura;
    elements.custoTotal.textContent = formatarMoeda(estado.custoTotal);
}

// Calcular preço de venda e lucro
function calcularPrecoVenda() {
    const precoCustom = getValor(elements.precoCustom);
    const margemDesejada = getValor(elements.margemLucro);

    if (precoCustom > 0) {
        // Usuário definiu um preço personalizado
        estado.precoVenda = precoCustom;
        estado.lucro = precoCustom - estado.custoTotal;

        // Calcular margem real
        if (estado.custoTotal > 0) {
            estado.margemReal = (estado.lucro / estado.custoTotal) * 100;
        } else {
            estado.margemReal = 0;
        }
    } else {
        // Calcular com base na margem desejada
        estado.lucro = estado.custoTotal * (margemDesejada / 100);
        estado.precoVenda = estado.custoTotal + estado.lucro;
        estado.margemReal = margemDesejada;
    }

    elements.lucroValor.textContent = formatarMoeda(estado.lucro);
    elements.precoVenda.textContent = formatarMoeda(estado.precoVenda);
    elements.margemReal.textContent = estado.margemReal.toFixed(1) + '%';

    // Colorir margem baseado no valor
    const margemElement = elements.margemReal;
    margemElement.style.color = estado.margemReal < 50 ? '#ef4444' :
                                 estado.margemReal < 100 ? '#f59e0b' : '#10b981';
}

// Calcular projeção
function calcularProjecao() {
    const vendas = getValor(elements.vendasMes);

    elements.vendasMesValor.textContent = vendas;

    const faturamento = estado.precoVenda * vendas;
    const lucro = estado.lucro * vendas;

    elements.faturamentoMensal.textContent = formatarMoeda(faturamento);
    elements.lucroMensal.textContent = formatarMoeda(lucro);
}

// Recalcular tudo
function recalcular() {
    calcularCustoFilamento();
    calcularCustoSuporte();
    calcularCustoEnergia();
    calcularCustoPintura();
    calcularCustoTotal();
    calcularPrecoVenda();
    calcularProjecao();
}

// Toggle seções colapsáveis
function setupToggles() {
    elements.usaSuporte.addEventListener('change', function() {
        elements.suporteContent.classList.toggle('active', this.checked);
        if (!this.checked) {
            elements.pesoSuporte.value = '';
        }
        recalcular();
    });

    elements.usaPintura.addEventListener('change', function() {
        elements.pinturaContent.classList.toggle('active', this.checked);
        if (!this.checked) {
            elements.tamanhoPeca.value = '0';
            elements.custoPinturaCustom.value = '';
        }
        recalcular();
    });
}

// Setup botões de margem
function setupMarginButtons() {
    marginBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const margin = this.dataset.margin;
            elements.margemLucro.value = margin;

            // Atualizar estado ativo
            marginBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            recalcular();
        });
    });

    // Remover estado ativo quando digitar manualmente
    elements.margemLucro.addEventListener('input', function() {
        marginBtns.forEach(b => b.classList.remove('active'));

        // Verificar se corresponde a algum botão
        marginBtns.forEach(btn => {
            if (btn.dataset.margin === this.value) {
                btn.classList.add('active');
            }
        });
    });
}

// Setup todos os event listeners
function setupEventListeners() {
    // Todos os inputs que afetam o cálculo
    const inputs = [
        elements.pesoPeca,
        elements.precoKilo,
        elements.pesoSuporte,
        elements.tempoHoras,
        elements.tempoMinutos,
        elements.potenciaImpressora,
        elements.precoKwh,
        elements.tamanhoPeca,
        elements.custoPinturaCustom,
        elements.margemLucro,
        elements.precoCustom,
        elements.vendasMes
    ];

    inputs.forEach(input => {
        input.addEventListener('input', recalcular);
    });

    // Limpar preço custom quando alterar margem
    elements.margemLucro.addEventListener('focus', function() {
        if (getValor(elements.precoCustom) === 0) return;
    });
}

// Inicialização
function init() {
    setupToggles();
    setupMarginButtons();
    setupEventListeners();

    // Marcar botão 100% como ativo inicialmente
    marginBtns.forEach(btn => {
        if (btn.dataset.margin === '100') {
            btn.classList.add('active');
        }
    });

    // Cálculo inicial
    recalcular();
}

// Iniciar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
