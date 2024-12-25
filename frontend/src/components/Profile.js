import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import '../assets/css/profile.css';
import {Helmet} from "react-helmet";

function Profile() {
    const serverUrl = 'http://192.168.1.104:8000/';

    const [isCsrf, setIsCsrf] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    const [isEmail, setIsEmail] = useState('')

    const navigate = useNavigate();


    const isResponseOk = (res) => {
        if (!(res.status >= 200 && res.status <= 299)) {
            throw Error(res.statusText);
        }
    }

    useEffect(() => {
        getSession()
    }, [])

    const getCSRF = () => {
        axios.get(serverUrl + 'api/csrf/', { withCredentials: true })
            .then((res) => {
                isResponseOk(res)

                const csrfToken = res.headers.get('X-CSRFToken')
                setIsCsrf(csrfToken)
            })
            .catch((err) => console.error(err))
    }

    const getSession = () => {
        axios.get(serverUrl + "api/session/", { withCredentials: true })
            .then((res) => {
                if (res.data.isAuthenticated) {
                    setIsAuth(true)
                    userInfo()
                    return
                }
                navigate('/login/')
                setIsAuth(false)
                getCSRF()
            })
            .catch(err => console.error(err))
    }

    const logout = () => {
        axios.get(serverUrl + "api/logout", { withCredentials: true })
            .then((res) => {
                isResponseOk(res)
                setIsAuth(false);
                navigate('/')
                window.location.reload()
                getCSRF();
            })
            .catch(err => console.error(err));
    }

    const userInfo = () => {
        axios.get(serverUrl + "api/user_info/", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                //console.log("Вы авторизованы как: " + res.data.email);
                setIsEmail(res.data.email)
            })
            .catch((err) => {
                if (err.status === 401) console.log(err.error);
            });
    }

    const killAllSessions = () => {
        axios.get(serverUrl + "api/kill_all_sessions/", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                isResponseOk(res)
                navigate('/')
                window.location.reload()
                console.log(res.data.detail)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <div className="profile">
            <Helmet>
                <title>NovelNook - Мой профиль</title>
            </Helmet>
            <div className="Profile-title">
                <h2 style={{marginBottom: '10px'}}>Ваш профиль</h2>
                <p>Ваши личные данные хранятся именно здесь</p>
            </div>
            <div>
                Вы вошли в аккаунт под {isEmail}
            </div>
            <div>
                <button
                    type="submit"
                    value='Выйти'
                    onClick={logout}
                    className="logout">Выйти из аккаунта
                </button>
                <br></br>
                <button
                    type="submit"
                    value='Удалить все сессии'
                    onClick={killAllSessions}
                    className="kill-all-session">Удалить все сессии
                </button>
            </div>
        </div>
    );
}

export default Profile;
