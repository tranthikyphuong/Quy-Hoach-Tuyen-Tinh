import LinearEquation from 'functional/linear-equation';
import FunctionalError from 'utils/error';

class GroupLinearEquation {
    /**
     *
     * @param {string[]} equations
     * @param {string} target
     */
    constructor(equations = [], target) {
        this._equations = equations.map((e) => {
            return new LinearEquation(e);
        });
        this._target = new LinearEquation(target);
    }

    checkValidAllConstraints(varsMap) {
        let isOk = true;
        for (const eq of this._equations) {
            if (!eq.checkValidInitRule(varsMap)) {
                isOk = false;
                break;
            }
        }
        return isOk;
    }

    getAllMeaningfulSystems() {
        const numRow = this._target.getVariables().length;
        if (this._equations.length < numRow) {
            throw new FunctionalError('Not found extreme', 404);
        }
        return this._getSubarrays(this._equations, numRow);
    }

    _getSubarrays(array, targetSubArrayCount) {
        if (array.length === 0 || array.length < targetSubArrayCount) {
            return [];
        }
        if (targetSubArrayCount === 1) {
            return array.map((item) => [item]);
        }
        const result = [];
        for (let i = 0; i < array.length; i++) {
            let subs = this._getSubarrays(array.slice(i + 1), targetSubArrayCount - 1);
            subs.forEach((sub) => {
                result.push([array[i], ...sub]);
            });
        }
        return result;
    }
}

export default GroupLinearEquation;
