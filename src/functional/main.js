import GroupLinearEquation from 'functional/group-linear-equation';
import SystemLinearEquation from 'functional/system-linear-equation';
import LinearEquation from 'functional/linear-equation';
import FunctionalError from 'utils/error';

class Calculator {
    /**
     *
     * @param {string[]} constraints
     * @param {string} target
     * @param {number} mode
     */
    process(constraints, target, mode) {
        const groupLinearEquation = new GroupLinearEquation(constraints, target);
        const targetEquation = new LinearEquation(target);
        let finalResult = null;
        let mappedVars = null;
        const systems = groupLinearEquation.getAllMeaningfulSystems();
        for (const sys of systems) {
            const linearSys = new SystemLinearEquation(sys, targetEquation.getVariables());
            let mappedResult;
            try {
                mappedResult = linearSys.solve();
            } catch (e) {
                console.log(e);
                continue;
            }
            if (!groupLinearEquation.checkValidAllConstraints(mappedResult)) {
                continue;
            }
            let targetExp = targetEquation._equation;
            mappedResult.forEach((value, key) => {
                targetExp = targetExp.replaceAll(key, `(${value})`);
            });
            const val = eval(targetExp);
            if (mode === 0) {
                if (!finalResult || finalResult > val) {
                    finalResult = val;
                    mappedVars = mappedResult;
                }
            } else {
                if (!finalResult || finalResult < val) {
                    finalResult = val;
                    mappedVars = mappedResult;
                }
            }
        }
        if (finalResult === null) {
            throw new FunctionalError('Not found extreme', 404);
        }
        return { objective: finalResult, variables: mappedVars };
    }
}

const calculator = new Calculator();
if (__DEV__) {
    window.Calculator = calculator;
}

export default calculator;
