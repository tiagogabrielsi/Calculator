const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const expandBtn = document.getElementById('expand-scientific');
const scientificDiv = document.querySelector('.scientific-buttons');

let expressao = "";

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const valor = btn.textContent;

        if (btn.id === "clear") {
            expressao = "";
            atualizarDisplay();
        } else if (btn.id === "equal") {
            calcular();
        } else if (btn.id === "plus") {
            adicionarOperador("+");
        } else if (btn.id === "minus") {
            adicionarOperador("-");
        } else if (btn.id === "multiply") {
            adicionarOperador("*");
        } else if (btn.id === "divide") {
            adicionarOperador("/");
        } else if (btn.id === "percentage") {
            expressao += "/100";
            atualizarDisplay();
        } else if (btn.id === "parentheses") {
            adicionarParenteses();
        } else if (valor === "+/-") {
            inverterSinal();
        } else if (valor === ",") {
            expressao += ".";
            atualizarDisplay();
        } else {
            expressao += valor;
            atualizarDisplay();
        }
    });
});

document.getElementById("backspace").addEventListener("click", () => {
    expressao = expressao.slice(0, -1);
    atualizarDisplay();
});

expandBtn.addEventListener('click', () => {
    if (scientificDiv.style.display === 'none' || scientificDiv.style.display === '') {
        scientificDiv.style.display = 'grid';
        expandBtn.innerHTML = '&#9664;'; // seta para a esquerda
    } else {
        scientificDiv.style.display = 'none';
        expandBtn.innerHTML = '&#9654;'; // seta para a direita
    }
});

// Funções científicas
const scientificButtons = document.querySelectorAll('.scientific-buttons button');

scientificButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.id;
        if (id === 'sin') {
            aplicarFuncaoCientifica(Math.sin, 'sin');
        } else if (id === 'cos') {
            aplicarFuncaoCientifica(Math.cos, 'cos');
        } else if (id === 'tan') {
            aplicarFuncaoCientifica(Math.tan, 'tan');
        } else if (id === 'log') {
            aplicarFuncaoCientifica(Math.log10 ? Math.log10 : (x) => Math.log(x) / Math.LN10, 'log');
        } else if (id === 'sqrt') {
            aplicarFuncaoCientifica(Math.sqrt, '√');
        } else if (id === 'pow') {
            expressao += '**';
            atualizarDisplay();
        } else if (id === 'pi') {
            expressao += Math.PI.toString();
            atualizarDisplay();
        } else if (id === 'e') {
            expressao += Math.E.toString();
            atualizarDisplay();
        }
    });
});

function atualizarDisplay() {
    display.value = expressao || "0";
}

function calcular() {
    try {
        let resultado = eval(expressao);
        expressao = resultado.toString();
        atualizarDisplay();
    } catch {
        display.value = "Erro";
        expressao = "";
    }
}

function adicionarOperador(op) {
    if (expressao === "") return;
    const ultimo = expressao[expressao.length - 1];
    if ("+-*/".includes(ultimo)) {
        expressao = expressao.slice(0, -1) + op;
    } else {
        expressao += op;
    }
    atualizarDisplay();
}

function adicionarParenteses() {
    const abre = (expressao.match(/\(/g) || []).length;
    const fecha = (expressao.match(/\)/g) || []).length;
    if (abre === fecha) {
        expressao += "(";
    } else {
        expressao += ")";
    }
    atualizarDisplay();
}

function inverterSinal() {
    if (!expressao) return;
    const match = expressao.match(/(-?\d+\.?\d*)$/);
    if (match) {
        const num = match[0];
        const invertido = num.startsWith("-") ? num.slice(1) : "-" + num;
        expressao = expressao.slice(0, -num.length) + invertido;
        atualizarDisplay();
    }
}

function aplicarFuncaoCientifica(func, nome) {
    let valor = 0;
    try {
        valor = eval(expressao);
    } catch {
        display.value = 'Erro';
        expressao = '';
        return;
    }
    // Para trigonometria, converter de graus para radianos
    if (['sin','cos','tan'].includes(nome)) {
        valor = valor * Math.PI / 180;
    }
    let resultado = func(valor);
    expressao = resultado.toString();
    atualizarDisplay();
}