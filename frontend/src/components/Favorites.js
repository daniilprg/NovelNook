import React, {useEffect, useState} from 'react';

import '../assets/css/favorites.css';
import '../assets/css/home.css';

import { Link } from 'react-router-dom';
import axios from "axios";
import Slider from "react-slick";

import {Helmet} from "react-helmet";

import LoadingSpinner from "./Loading";

const SampleArrow = ({ className, style, onClick, isHidden }) => (
    <div
        className={className}
        style={{ ...style, display: isHidden ? 'none' : 'flex', top: '45%' }}
        onClick={onClick}
    />
);

function Favorites() {

    const [loading, setLoading] = useState(true);

    const serverUrl = 'http://192.168.1.104:8000/';

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);


    const [currentSlide, setCurrentSlide] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const [isAuth, setIsAuth] = useState(false)
    const [isCsrf, setIsCsrf] = useState(null)

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1170);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        getSession()
        setLoading(false)
    }, [])

    const settings = isMobile
        ? {
            speed: 250,
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
        } :
        {
            speed: 250,
            slidesToShow: 7,
            slidesToScroll: 1.5,
            infinite: false,
            beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
            prevArrow: (
                <SampleArrow
                    isHidden={currentSlide === 0}
                />
            ),
            nextArrow: (
                <SampleArrow
                    isHidden={currentSlide >= 2}
                />
            )
        }

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
                    userFavoritesInfo()
                    return
                }
                setIsAuth(false)
                getCSRF()
            })
            .catch(err => console.error(err))
    }

    const userFavoritesInfo = () => {
        axios.get(serverUrl + "api-favoritres/favorites/get/", {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                setFavorites(res.data);
            })
            .catch((err) => {
                if (err.status === 401) console.log(err.error);
            });
    }

    return (
        <div>
            <Helmet>
                <title>Отложено</title>
            </Helmet>
            <div className="Favorites-title">
                <h2 style={{marginBottom: '20px'}}>Отложенные книги</h2>
                <h3 style={{marginBottom: '10px'}}>Читаю и откладываю</h3>
                <p>Здесь будет появляться все, что вы читаете и добавляете в избранное</p>
            </div>
            <p className="text">Избранное
                <svg width="9" height="18" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                     style={{marginLeft: '12px'}}>
                    <path
                        d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                        fill="#594C91"></path>
                </svg>
            </p>
            {
                loading ? (
                    <div>
                        <LoadingSpinner />
                        <p style={{
                            marginBottom: '20%'
                        }}></p>
                    </div>
                    ) : !isAuth ?  (
                        <p>Войдите в аккаунт, чтобы добавить книги в избранное</p>)
                    :
                    <div>
                        {favorites.length > 0 ? (
                            <Slider {...settings} className="slider-margin-books">
                                {favorites.map((fav) => (
                                    <div key={fav.id}>
                                        <Link to={`/book/${fav.book_title}`}>
                                            <img
                                                className="slider-image"
                                                style={{borderRadius: '5px'}}
                                                src={`${serverUrl}${fav.book_cover}`}
                                                alt={fav.book_title}
                                            />
                                        </Link>
                                        <div style={{ marginRight: 0 }}>
                                            <Link
                                                style={{textDecoration: 'none', color: '#000'}}
                                                to={`/book/${fav.id}`}
                                            >
                                                <p style={{marginTop: '8px', fontWeight: '650', marginBottom: '3px'}}>
                                                    {fav.book_title}
                                                </p>
                                            </Link>
                                            <span style={{fontWeight: '450', color: '#9D9D9D'}}>
                                            {fav.book_author}
                                        </span>
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p style={{
                                marginBottom: '18%'
                            }}>Вы ещё не добавляли книг в избранное</p>
                        )}
                    </div>
            }
        </div>
    );
}

export default Favorites;
