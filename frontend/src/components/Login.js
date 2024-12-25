import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

import '../assets/css/login.css';
import {Helmet} from "react-helmet";

function Login() {

    const serverUrl = 'http://192.168.1.104:8000/'

    const [isCsrf, setIsCsrf] = useState(null)
    const [isError, setIsError] = useState(null)

    const [isAuth, setIsAuth] = useState(false)

    const [isEmail, setIsEmail] = useState('')
    const [isPassword, setIsPassword] = useState('')

    //const [userId, setUserId] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        getSession()
    }, [])

    const isResponseOk = (res) => {
        if (!(res.status >= 200 && res.status <= 299)) {
            throw Error(res.statusText);
        }
    }

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
                    navigate('/')
                    return
                }

                setIsAuth(false)
                getCSRF()
            })
            .catch(err => console.error(err))
    }

    const login = () => {
        const data = { email: isEmail, password: isPassword }
        axios.post(serverUrl + "api/login/", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": isCsrf,
            }
        })
            .then((res) => {
                isResponseOk(res)
                setIsAuth(true)
                setIsEmail('')
                setIsPassword('')
                setIsError(null)
                navigate('/')
            })
            .catch((err) => {
                console.error(err);
                setIsError("Неправильный логин или пароль")
            });
    }

    function changePassword(e) {
        setIsPassword(e.target.value)
    }

    function changeEmail(e) {
        setIsEmail(e.target.value)
    }

    function submitForm(e) {
        e.preventDefault()

        login()
    }

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    return (
        <div className="login-container">
            <Helmet>
                <title>NovelNook - Авторизация</title>
            </Helmet>
            <div className="login-form">
                <Link to="/" style={{display: 'flex', justifyContent: 'right'}}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13.3685 0.000172173C13.2056 0.00401933 13.0508 0.0721637 12.938 0.189727L6.99996 6.12777L1.06192 0.189727C1.00442 0.130514 0.93563 0.0834415 0.859611 0.0512958C0.783593 0.0191501 0.701897 0.00258506 0.619361 0.00258176C0.496598 0.00261172 0.376635 0.0392674 0.274822 0.107859C0.173008 0.17645 0.0939737 0.273858 0.0478309 0.387619C0.00168819 0.501381 -0.0094645 0.626322 0.0157995 0.746458C0.0410636 0.866593 0.101595 0.976459 0.189651 1.062L6.12769 7.00004L0.189651 12.9381C0.13045 12.9949 0.0831861 13.063 0.0506265 13.1383C0.0180668 13.2137 0.00086628 13.2947 3.18869e-05 13.3768C-0.000802506 13.4589 0.0147462 13.5403 0.0457673 13.6163C0.0767884 13.6922 0.122658 13.7613 0.180691 13.8193C0.238723 13.8773 0.307752 13.9232 0.383734 13.9542C0.459715 13.9853 0.541123 14.0008 0.623189 14C0.705255 13.9991 0.78633 13.9819 0.861665 13.9494C0.937001 13.9168 1.00508 13.8695 1.06192 13.8103L6.99996 7.87231L12.938 13.8103C12.9948 13.8695 13.0629 13.9168 13.1383 13.9494C13.2136 13.9819 13.2947 13.9991 13.3767 14C13.4588 14.0008 13.5402 13.9853 13.6162 13.9542C13.6922 13.9232 13.7612 13.8773 13.8192 13.8193C13.8773 13.7613 13.9231 13.6922 13.9542 13.6163C13.9852 13.5403 14.0007 13.4589 13.9999 13.3768C13.9991 13.2947 13.9819 13.2137 13.9493 13.1383C13.9167 13.063 13.8695 12.9949 13.8103 12.9381L7.87223 7.00004L13.8103 1.062C13.9 0.975903 13.9616 0.864712 13.987 0.743002C14.0124 0.621292 14.0004 0.494743 13.9527 0.379947C13.9049 0.265152 13.8236 0.167465 13.7193 0.0996957C13.6151 0.031926 13.4928 -0.00276453 13.3685 0.000172173Z"
                            fill="#9D9D9D"/>
                    </svg>
                </Link>
                <h2 className="login-title">Войти</h2>
                <p style={{marginBottom: '15px', fontWeight: '500'}}>Введите почту и пароль</p>
                <form>
                    <div className="input-group" style={{
                        marginBottom: '15px'
                    }}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            placeholder=" "
                            onChange={changeEmail}
                            value={isEmail}
                        />
                        <label htmlFor="email" className={emailFocused ? 'focused' : ''}>Почта</label>
                    </div>
                    <div className="input-group" style={{
                        marginBottom: '5px'
                    }}>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            onFocus={() => setPasswordFocused(true)}
                            onBlur={() => setPasswordFocused(false)}
                            placeholder=" "
                            onChange={changePassword}
                            value={isPassword}
                        />
                        <label htmlFor="password" className={passwordFocused ? 'focused' : ''}>Пароль</label>
                    </div>
                    {
                        isError ? <div style={{
                            fontSize: '12px',
                            color: 'red',
                            marginBottom: '15px',
                            marginLeft: '14px',
                        }}>{isError}</div> : null
                    }
                    <button type="submit"
                            className="login-button"
                            onClick={submitForm}>
                        Продолжить
                    </button>
                </form>
                <p style={{
                    marginBottom: '10px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center'
                }}>При входе на ресурс вы принимаете <a style={{textDecoration: 'none'}} href='/'>публичную
                    оферту</a> и <a style={{textDecoration: 'none'}} href='/'>обработку персональных данных</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
