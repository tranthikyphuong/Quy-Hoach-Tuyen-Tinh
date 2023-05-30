import FunctionalError from 'utils/error';

class LinearEquation {
    constructor(equation = '') {
        this._equation = equation;
        if (this._equation.includes('≥')) {
            this._checker = 1;
        } else if (this._equation.includes('≤')) {
            this._checker = -1;
        } else {
            this._checker = 0;
        }
        this._equation = this._equation.replace('≥', '=').replace('≤', '=');
        if (this._equation.startsWith('-')) {
            this._equation = '0' + this._equation;
        }
        this._equation = this._equation
            .replace('=-', '=(%1)*')
            .replaceAll('-', '+(-1)*')
            .replaceAll('%', '-');
        this._checkSyntax();
    }

    _checkSyntax() {
        const errorSyntax = new FunctionalError('Wrong syntax of linear equation', 400);
        let equation = this._equation.replace('=', '-');
        let vars = this.getVariables();
        if (vars.length < 1 || new Set(vars).size !== vars.length || equation.includes('^')) {
            throw errorSyntax;
        }
        for (const v of vars) {
            equation = equation.replaceAll(v, '(-1.2345)');
        }
        try {
            eval(equation);
        } catch (e) {
            throw errorSyntax;
        }
    }

    checkValidInitRule(varsMap) {
        let express = this._equation.replace('=', '-');
        varsMap.forEach((value, key) => {
            express = express.replaceAll(key, `(${value})`);
        });
        const val = eval(express);
        if (this._checker > 0) {
            return val >= 0;
        }
        if (this._checker < 0) {
            return val <= 0;
        }
        return val === 0;
    }

    getVariables() {
        const operands = this._equation.split(/\+|\-|\=/);
        const vars = [];
        operands.forEach((op) => {
            const arr = op.split('*');
            arr.forEach((v) => {
                if (v.match(/^[a-zA-Z]/)) {
                    vars.push(v);
                }
            });
        });
        return vars;
    }

    getCoefficients() {
        const equation = this._equation;
        const operands = equation.split(/\+|\=/);
        const coefs = [];
        operands.forEach((op) => {
            const arr = op.split('*');
            arr.forEach((v, i) => {
                if (!v.match(/^[a-zA-Z]/)) {
                    coefs.push(v);
                } else if (i === 0) {
                    coefs.push('1');
                }
            });
        });
        return coefs.map((c) => eval(c));
    }

    getCoefficientsWithVars(vars = []) {
        let equation = this._equation;
        vars.forEach((v) => {
            if (!equation.includes(v)) {
                equation = `0*${v}+` + equation;
            }
        });
        const operands = equation.split(/\+|\=/);
        const coefs = new Map();
        operands.forEach((op) => {
            const arr = op.split('*');
            let varr = null;
            let c = [];
            arr.forEach((v) => {
                if (v.match(/^[a-zA-Z]/)) {
                    varr = v;
                } else {
                    c.push(v);
                }
            });
            if (varr !== null) {
                coefs.set(varr, eval(c.join('*')));
            }
        });
        return coefs;
    }
}

if (__DEV__) {
    window.LinearEquation = LinearEquation;
}

export default LinearEquation;
