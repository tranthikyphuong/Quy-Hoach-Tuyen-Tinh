import LinearEquation from 'functional/linear-equation';
import Matrix from 'functional/matrix';

class SystemLinearEquation {
    /**
     *
     * @param {LinearEquation[]} equations
     */
    constructor(equations = [], vars = []) {
        this._equations = equations;
        this._vars = vars;
    }

    solve() {
        const baseMatrix = new Matrix(
            this._equations.map((eq) => {
                const m = eq.getCoefficientsWithVars(this._vars);
                return this._vars.map((v) => m.get(v) ?? 1);
            })
        );
        const rightMaxtrix = this._equations.map((eq) => {
            const c = eq.getCoefficients();
            return c[c.length - 1];
        });
        const D = baseMatrix.getDeterminant();
        if (D === 0) {
            throw Error('No result');
        }
        const result = new Map();
        this._vars.forEach((v, i) => {
            const Dv = baseMatrix.replaceCol(i, rightMaxtrix).getDeterminant();
            result.set(v, Dv / D);
        });
        return result;
    }
}

export default SystemLinearEquation;
