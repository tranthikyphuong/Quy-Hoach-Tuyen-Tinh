import React from 'react';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import CSSTransition from 'react-transition-group/CSSTransition';

const ModalContent = ({ show, onClose, children, className }) => {
    const containerRef = React.useRef(null);
    const contentRef = React.useRef(null);

    React.useEffect(() => {
        if (show) {
            containerRef.current?.classList.add('show');
            contentRef.current?.classList.add('appear');
        } else {
            contentRef.current?.classList.remove('appear');
            containerRef.current?.classList.remove('show');
        }
    }, [show]);

    const content = (
        <div ref={containerRef} className={'t-modal'}>
            <div ref={contentRef} className={clsx('t-modal-content', className)}>
                <button className="t-modal-close-btn" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
};

class Modal extends React.PureComponent {
    render() {
        const { show, timeout = 500 } = this.props;
        return (
            <CSSTransition in={show} timeout={timeout} unmountOnExit>
                <ModalContent {...this.props} />
            </CSSTransition>
        );
    }
}

export default Modal;
