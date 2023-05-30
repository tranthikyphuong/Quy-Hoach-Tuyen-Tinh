import React from 'react';
import AppConfig from 'config/app';
import Scrollbars from 'react-custom-scrollbars-2';
import LogoSvg from 'static/img/logo.svg';
import FootCatSvg from 'static/img/footcat.svg';
import EquationEditor from 'utils/equation-editor';
import ClientId from 'utils/client-id';
import { useFormik } from 'formik';
import Calculator from 'functional/main';
import UIState from 'state/context';
import UIStateActions from 'state/actions';

const CalculatorView = () => {
    const [mode, setMode] = React.useState(0);
    const { dispatch } = React.useContext(UIState);
    const isLastAdd = React.useRef(false);
    const scrollRef = React.useRef(null);
    const ClientID = React.useMemo(() => {
        return new ClientId();
    }, []);
    const [constraints, setConstraints] = React.useState(
        Array(AppConfig.default_constraints)
            .fill(0)
            .map(() => ({
                value: '',
                id: ClientID.next(),
            }))
    );

    const onAddConstraint = () => {
        setConstraints([...constraints, { value: '', id: ClientID.next() }]);
        isLastAdd.current = true;
    };

    React.useEffect(() => {
        if (isLastAdd.current) {
            scrollRef.current.scrollToBottom();
            isLastAdd.current = false;
        }
    }, [constraints]);

    const onRemoveConstraint = (id) => {
        const temp = [...constraints];
        const idx = temp.findIndex((it) => it.id === id);
        if (idx >= 0) {
            temp.splice(idx, 1);
            setConstraints(temp);
        }
    };

    const onReset = () => {
        setConstraints(
            Array(AppConfig.default_constraints)
                .fill(0)
                .map(() => ({
                    value: '',
                    id: ClientID.next(),
                }))
        );
    };

    const onChangeConstraint = (text, index) => {
        const items = [...constraints];
        items[index].value = text;
        setConstraints(items);
    };

    const formik = useFormik({
        initialValues: {
            objectiveFunction: '',
        },
        onSubmit: (values) => {
            try {
                const result = Calculator.process(
                    constraints.map((c) => c.value),
                    values.objectiveFunction,
                    mode
                );
                console.log(result);
                dispatch({
                    type: UIStateActions.SHOW_RESULT,
                    payload: { show: true, result, error: null },
                });
            } catch (e) {
                if (e.code === 400) {
                    dispatch({
                        type: UIStateActions.SHOW_WRONG_INPUT,
                        payload: true,
                    });
                } else {
                    dispatch({
                        type: UIStateActions.SHOW_RESULT,
                        payload: { show: true, error: e, result: null },
                    });
                }
            }
        },
    });

    return (
        <div className="calculator">
            <LogoSvg className="calculator-logo" />
            <form onSubmit={formik.handleSubmit} className="calculator-form">
                <label htmlFor="objective-function">The Objective Function</label>
                <div className="calculator-objective-func-wrapper">
                    <EquationEditor
                        id="objectiveFunction"
                        onChange={(text) => formik.setFieldValue('objectiveFunction', text)}
                        className="calculator-input"
                    />
                    <button
                        type="button"
                        onClick={() => setMode(mode === 0 ? 1 : 0)}
                        className={
                            'calculator-objective-func-mode' + (mode === 0 ? ' min' : ' max')
                        }>
                        {mode === 0 ? 'Min' : 'Max'}
                    </button>
                </div>
                <label htmlFor="constraints">The Constraints</label>
                <Scrollbars ref={scrollRef} className="calculator-constraints" id="constraints">
                    {constraints.map((v, key) => (
                        <div key={v.id} className="calculator-constraints-wrapper">
                            <button
                                onClick={() => onRemoveConstraint(v.id)}
                                type="button"
                                className="calculator-constraints-remove">
                                -
                            </button>
                            <EquationEditor
                                id={'constraint_' + (key + 1)}
                                className="calculator-input"
                                onChange={(text) => onChangeConstraint(text, key)}
                            />
                            <button
                                onClick={onAddConstraint}
                                type="button"
                                className="calculator-constraints-add">
                                +
                            </button>
                        </div>
                    ))}
                </Scrollbars>
                <div className="calculator-form-footer">
                    <button onClick={onReset} className="calculator-form-reset" type="reset">
                        Reset
                    </button>
                    <button className="calculator-form-submit" type="submit">
                        =
                    </button>
                </div>
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

export default CalculatorView;
