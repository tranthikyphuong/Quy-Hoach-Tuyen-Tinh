import React from 'react';
import WrongPng from 'static/img/wrong.png';

const WrongView = () => {
    return (
        <div className="wrong-container">
            <img className="wrong-img" src={WrongPng} />
        </div>
    );
};

export default WrongView;
