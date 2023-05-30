import React from 'react';
import Modal from 'common/modal';
import UIState from 'state/context';
import reducer, { defaultState } from 'state/reducer';
import CalculatorView from 'view/calculator';
import ResultView from 'view/result';
import WrongView from 'view/wrong';
import UIStateActions from 'state/actions';
import InfoSvg from 'static/img/information.svg';
import InformationView from 'view/information';

const connectUIState = (App) => {
    return () => {
        const [state, dispatch] = React.useReducer(reducer, defaultState);
        return (
            <UIState.Provider value={{ state, dispatch }}>
                <App />
            </UIState.Provider>
        );
    };
};

const App = () => {
    const { state, dispatch } = React.useContext(UIState);

    const onCloseWrong = () => {
        dispatch({ type: UIStateActions.SHOW_WRONG_INPUT, payload: false });
    };

    const onToggleInfo = (show) => {
        dispatch({ type: UIStateActions.SHOW_INFO, payload: show });
    };

    return (
        <div className="app">
            {state.showResult.show ? <ResultView /> : <CalculatorView />}
            <Modal onClose={onCloseWrong} show={state.showWrongInput}>
                <WrongView />
            </Modal>
            <Modal onClose={() => onToggleInfo(false)} show={state.showInfo}>
                <InformationView />
            </Modal>
            <button onClick={() => onToggleInfo(true)} className="info-btn">
                <InfoSvg width="30" height="30" />
            </button>
        </div>
    );
};

export default connectUIState(App);
