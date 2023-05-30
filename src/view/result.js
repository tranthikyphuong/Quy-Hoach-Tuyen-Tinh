import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import LogoSvg from 'static/img/logo.svg';
import FeetCatPng from 'static/img/feetcat.png';
import FootCatSvg from 'static/img/footcat.svg';
import EquationEditor from 'utils/equation-editor';
import UIState from 'state/context';
import UIStateActions from 'state/actions';

const ResultView = () => {
    const { dispatch, state } = React.useContext(UIState);
    const { showResult } = state;

    return (
        <div className="calculator">
            <LogoSvg className="calculator-logo" />
            <form className="calculator-form">
                <label htmlFor="objective-function">Objective</label>
                <div className="calculator-objective-func-wrapper">
                    <EquationEditor
                        value={showResult.result?.objective}
                        id="objective-function"
                        className="calculator-input"
                    />
                    <button
                        onClick={() =>
                            dispatch({ type: UIStateActions.SHOW_RESULT, payload: { show: false } })
                        }
                        type="button"
                        className="calculator-objective-func-mode">
                        AC
                    </button>
                </div>
                <label htmlFor="constraints">Variables</label>
                <Scrollbars className="calculator-constraints" id="constraints">
                    {showResult.result ? (
                        Array.from(showResult.result.variables || []).map(([key, value]) => {
                            return (
                                <div key={key} className="calculator-constraints-wrapper">
                                    <img className="calculator-result-var-img" src={FeetCatPng} />
                                    <EquationEditor
                                        id={'constraint_' + key}
                                        value={`${key}=${value}`}
                                        className="calculator-input"
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <span className="calculator-result-not-found">
                            {showResult.error?.message}
                        </span>
                    )}
                </Scrollbars>
            </form>
            <div className="calculator-footcat">
                <FootCatSvg width="80" height="80" />
            </div>
            <div className="calculator-footcat-right">
                <FootCatSvg width="80" height="80" />
            </div>
        </div>
    );
};

export default ResultView;
