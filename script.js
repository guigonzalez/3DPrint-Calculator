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

// ============================================
// SISTEMA DE ABAS
// ============================================

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function setupTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;

            // Remover active de todos
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Ativar aba clicada
            this.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');

            // Recalcular sugestões quando abrir a aba
            if (tabId === 'sugestoes') {
                calcularSugestoes();
            }
        });
    });
}

// ============================================
// SUGESTÕES DE PREÇOS
// ============================================

// Configurações padrão para cada tipo de peça
const configPecas = {
    // Flexi (sem suporte, sem pintura)
    'flexi-p': { peso: 30, horas: 2, suporte: 0, pintura: 0 },
    'flexi-m': { peso: 60, horas: 4, suporte: 0, pintura: 0 },
    'flexi-g': { peso: 120, horas: 7, suporte: 0, pintura: 0 },

    // Estatuetas sem pintura (com suporte ~20% do peso)
    'estatua-p': { peso: 25, horas: 3, suporte: 5, pintura: 0 },
    'estatua-m': { peso: 80, horas: 6, suporte: 16, pintura: 0 },
    'estatua-g': { peso: 200, horas: 12, suporte: 40, pintura: 0 },
    'estatua-xg': { peso: 400, horas: 20, suporte: 80, pintura: 0 },

    // Estatuetas com pintura
    'pintada-p': { peso: 25, horas: 3, suporte: 5, pintura: 15 },
    'pintada-m': { peso: 80, horas: 6, suporte: 16, pintura: 35 },
    'pintada-g': { peso: 200, horas: 12, suporte: 40, pintura: 60 },
    'pintada-xg': { peso: 400, horas: 20, suporte: 80, pintura: 100 },

    // Utilitários (sem suporte, sem pintura)
    'util-p': { peso: 20, horas: 1.5, suporte: 0, pintura: 0 },
    'util-m': { peso: 50, horas: 3, suporte: 0, pintura: 0 },
    'util-g': { peso: 150, horas: 8, suporte: 0, pintura: 0 }
};

// Elementos da aba de sugestões
const configPrecoKilo = document.getElementById('configPrecoKilo');
const configMargem = document.getElementById('configMargem');

function calcularCustoPeca(config, precoKilo, potencia = 350, precoKwh = 0.85) {
    // Custo do filamento (peça + suporte)
    const custoFilamento = ((config.peso + config.suporte) * precoKilo) / 1000;

    // Custo de energia
    const consumoKwh = (potencia / 1000) * config.horas;
    const custoEnergia = consumoKwh * precoKwh;

    // Custo total
    return custoFilamento + custoEnergia + config.pintura;
}

function calcularSugestoes() {
    const precoKilo = parseFloat(configPrecoKilo.value) || 120;
    const margem = parseFloat(configMargem.value) || 100;

    // Para cada tipo de peça, calcular e atualizar
    Object.keys(configPecas).forEach(tipo => {
        const config = configPecas[tipo];
        const custo = calcularCustoPeca(config, precoKilo);
        const venda = custo * (1 + margem / 100);

        // Converter tipo para IDs dos elementos (flexi-p -> flexiP)
        const idBase = tipo.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());

        const custoEl = document.getElementById(`${idBase}Custo`);
        const vendaEl = document.getElementById(`${idBase}Venda`);

        if (custoEl) custoEl.textContent = formatarMoeda(custo);
        if (vendaEl) vendaEl.textContent = formatarMoeda(venda);
    });
}

function setupSugestoes() {
    // Recalcular quando alterar configurações
    if (configPrecoKilo) {
        configPrecoKilo.addEventListener('input', calcularSugestoes);
    }
    if (configMargem) {
        configMargem.addEventListener('input', calcularSugestoes);
    }

    // Calcular inicial
    calcularSugestoes();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function init() {
    setupTabs();
    setupToggles();
    setupMarginButtons();
    setupEventListeners();
    setupSugestoes();

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
