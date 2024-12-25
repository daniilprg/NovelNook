import React from 'react';
import '../assets/css/novelgpt.css';
import {Helmet} from "react-helmet";

function NovelGPT() {
    return (
        <div>
            <Helmet>
                <title>NovelGPT - личный помощник</title>
            </Helmet>
            <div className="NovelGPT-title">
                <h2 style={{marginBottom: '10px'}}>NovelGPT</h2>
                <p>Искусственный интеллект ответит на любой ваш вопрос, касающийся сервиса NovelNook</p>
            </div>
            <p className="in-dev">Модель находится в стадии разработки</p>
        </div>
    );
}

export default NovelGPT;
