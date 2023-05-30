import produce from 'immer';
import UIStateActions from './actions';

export const defaultState = {
    showResult: {
        show: false,
        result: null,
        error: null,
    },
    showInfo: false,
    showWrongInput: false,
};

const reducer = (state = defaultState, action) =>
    produce(state, (draft) => {
        const { type, payload } = action;
        switch (type) {
            case UIStateActions.SHOW_RESULT:
                draft.showResult = payload;
                break;
            case UIStateActions.SHOW_INFO:
                draft.showInfo = payload;
                break;
            case UIStateActions.SHOW_WRONG_INPUT:
                draft.showWrongInput = payload;
                break;
            default:
                break;
        }
    });

export default reducer;
