import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';

import { Link } from 'react-router-dom';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import '../assets/css/home.css';

import banner0 from '../assets/img/banner0.jpg';
import banner1 from '../assets/img/banner1.jpg';
import banner2 from '../assets/img/banner2.jpg';
import banner3 from '../assets/img/banner3.jpg';
import banner4 from '../assets/img/banner4.jpg';
import {Helmet} from "react-helmet";

const SampleArrow = ({ className, style, onClick, isHidden }) => (
    <div
        className={className}
        style={{ ...style, display: isHidden ? 'none' : 'flex', top: '45%' }}
        onClick={onClick}
    />
);

function Home() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.1.104:8000/api-books/books/')
            .then(response => setBooks(response.data))
            .catch(error => console.error('Ошибка получения списка книг:', error));
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1170);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const settingsBanners = isMobile
        ? {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
        }
        : {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            customPaging: (i) => (
                <button className={`custom-dot dot-${i + 1}`} />
            ),
        };


    const bestsellers = books.filter(book => book.genre === 'Бестселлер');
    const newReleases = books.filter(book => book.genre === 'Новинки');

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

    return (
        <div>
            <Helmet>
                <title>NovelNook - цифровой сервис электронных книг</title>
            </Helmet>
            <div style={ !isMobile ?
                {display: 'grid', gridTemplateColumns: '75% auto', width: '100%'} :
                null
            }>
                <Slider {...settingsBanners}>
                    <div>
                        <img className="slider-image" src={banner1} alt='slide-2'/>
                    </div>
                    <div>
                        <img className="slider-image" src={banner0} alt='slide-1'/>
                    </div>
                    <div>
                        <img className="slider-image" src={banner2} alt='slide-3'/>
                    </div>
                </Slider>
                { !isMobile ?
                    <div style={{marginLeft: '30px', marginTop: '3px'}}>
                        <div style={{position: 'relative'}}>
                            <img style={{width: '97%', height: '130px', objectFit: 'cover'}} className="slider-image"
                                 src={banner3} alt='slide-1'/>
                        </div>
                        <div style={{marginTop: '37px', position: 'relative'}}>
                            <img style={{width: '97%', height: '130px', objectFit: 'cover'}} className="slider-image"
                                 src={banner4} alt='slide-2'/>
                        </div>
                    </div>
                    : null }
            </div>
            <div style={{marginTop: '35px'}}>
                <p style={{
                    fontWeight: '700',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '10px'
                }}>
                    Рекомендации
                    <svg style={{marginLeft: '12px'}} width="9" height="18" viewBox="0 0 11 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                            fill="#594C91"/>
                    </svg>
                </p>
                <p>У вас пока нет рекомендаций</p>
            </div>
            <div style={{marginTop: '75px'}} className="slider-margin-books">
                <p style={{
                    fontWeight: '700',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '10px'
                }}>
                    Бестселлеры
                    <svg style={{marginLeft: '12px'}} width="9" height="18" viewBox="0 0 11 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                            fill="#594C91"/>
                    </svg>
                </p>
                <Slider {...settings} className="slider-margin-books">
                    {bestsellers.map((book, index) => (
                        <div key={index}>
                            <Link to={`/book/${book.title}`}>
                                <img
                                    className="slider-image"
                                    style={{ borderRadius: '5px' }}
                                    src={`http://192.168.1.104:8000${book.cover}`}
                                    alt={`slide-${index + 1}`}
                                />
                            </Link>
                            <div style={{ marginRight: 0 }}>
                                <Link style={{
                                    textDecoration: 'none',
                                    color: '#000'
                                }} to={`/book/${book.id}`}>
                                    <p style={{
                                        marginTop: '8px',
                                        fontWeight: '650',
                                        marginBottom: '3px',
                                    }}>{book.title}</p>
                                </Link>
                                <span style={{
                                    fontWeight: '450',
                                    color: '#9D9D9D'
                                }}>{book.author}</span>
                            </div>
                        </div>
                    ))}
                    <div>
                        <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '650',
                            color: '#594C91',
                            cursor: 'pointer',
                            width: '100%',
                            height: '296px',
                            backgroundColor: 'rgba(89,76,145,0.11)',
                            borderRadius: '5px',
                        }}>
                            Еще <svg style={{marginLeft: '15px'}} width="7" height="18" viewBox="0 0 11 20" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                                fill="#594C91"/>
                        </svg>
                        </p>
                    </div>
                </Slider>
            </div>
            <div style={{marginTop: '75px'}}>
                <p style={{
                    fontWeight: '700',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginBottom: '10px'
                }}>
                    Новинки
                    <svg style={{marginLeft: '12px'}} width="9" height="18" viewBox="0 0 11 20" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                            fill="#594C91"/>
                    </svg>
                </p>
                <Slider {...settings} className="slider-margin-books">
                    {newReleases.map((book, index) => (
                        <div key={index}>
                            <Link to={`/book/${book.title}`}>
                                <img
                                    className="slider-image"
                                    style={{ borderRadius: '5px' }}
                                    src={`http://192.168.1.104:8000${book.cover}`}
                                    alt={`slide-${index + 1}`}
                                />
                            </Link>
                            <div style={{ marginRight: 0 }}>
                                <Link style={{
                                    textDecoration: 'none',
                                    color: '#000'
                                }} to={`/book/${book.title}`}>
                                    <p style={{
                                        marginTop: '8px',
                                        fontWeight: '650',
                                        marginBottom: '3px',
                                    }}>{book.title}</p>
                                </Link>
                                <span style={{
                                    fontWeight: '450',
                                    color: '#9D9D9D'
                                }}>{book.author}</span>
                            </div>
                        </div>
                    ))}
                    <div>
                        <p style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '650',
                            color: '#594C91',
                            cursor: 'pointer',
                            width: '100%',
                            height: '296px',
                            backgroundColor: 'rgba(89,76,145,0.11)',
                            borderRadius: '5px',
                        }}>
                            Еще <svg style={{marginLeft: '15px'}} width="7" height="18" viewBox="0 0 11 20" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1.50316 0C1.20522 7.64728e-05 0.914077 0.0937185 0.66698 0.268946C0.419882 0.444173 0.22807 0.693017 0.116083 0.983637C0.00409665 1.27426 -0.0229724 1.59344 0.0383424 1.90034C0.0996573 2.20725 0.246567 2.48792 0.460273 2.70644L7.38623 9.9968L0.460273 17.2872C0.316596 17.4324 0.201888 17.6063 0.122868 17.7987C0.0438475 17.9912 0.00210216 18.1983 7.7368e-05 18.408C-0.00194743 18.6176 0.0357897 18.8256 0.111077 19.0197C0.186364 19.2138 0.297687 19.3901 0.43853 19.5384C0.579372 19.6867 0.746901 19.8038 0.931306 19.8831C1.11571 19.9623 1.31328 20.0021 1.51245 19.9999C1.71163 19.9978 1.90839 19.9538 2.09123 19.8707C2.27406 19.7875 2.43929 19.6667 2.57724 19.5155L10.5617 11.111C10.8423 10.8154 11 10.4147 11 9.9968C11 9.57893 10.8423 9.17817 10.5617 8.88263L2.57724 0.47809C2.4377 0.326823 2.27073 0.206568 2.08624 0.124447C1.90175 0.0423258 1.70347 8.38235e-06 1.50316 0Z"
                                fill="#594C91"/>
                        </svg>
                        </p>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default Home;
