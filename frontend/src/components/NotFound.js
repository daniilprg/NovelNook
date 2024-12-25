import React from 'react';

import { Link } from 'react-router-dom';

import '../assets/css/NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 style={{
                fontSize: '76px',
                color: '#738f42',
            }}>404</h1>
            <h2 style={{
                color: '#738f42',
                marginBottom: '50px'
            }}>Извините, такой страницы нет</h2>
            <Link to="/">
                <button className="button-home">На главную</button>
            </Link>

        </div>
    );
};

export default NotFound;
