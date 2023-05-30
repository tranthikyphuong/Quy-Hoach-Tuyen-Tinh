import React from 'react';
import InfoPng from 'static/img/info.png';

const InformationView = () => {
    return (
        <div className="info-container">
            <img className="info-img" src={InfoPng} />
            <span className="info-name">Tran Thi Ky Phuong</span>
            <span>MSSV: 20110287</span>
        </div>
    );
};

export default InformationView;
