import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Slider from "react-slick";

import '../assets/css/searchpage.css';
import '../assets/css/home.css';

const SampleArrow = ({ className, style, onClick, isHidden }) => (
    <div
        className={className}
        style={{ ...style, display: isHidden ? 'none' : 'flex', top: '45%' }}
        onClick={onClick}
    />
);

function SearchPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    const [currentSlide, setCurrentSlide] = useState(0);

    const { user_request } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const serverUrl = 'http://192.168.1.104:8000/'

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1170);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        axios.get(`${serverUrl}api-books/books/`)
            .then(response => {
                const filteredBooks = response.data.filter(book =>
                    book.title.toLowerCase().includes(user_request.toLowerCase()) ||
                    book.author.toLowerCase().includes(user_request.toLowerCase()) ||
                    book.genre.toLowerCase().includes(user_request.toLowerCase()) ||
                    book.description.toLowerCase().includes(user_request.toLowerCase())
                );
                if (filteredBooks.length > 0) {
                    setBooks(filteredBooks);
                } else {
                    setError('По вашему запросу ничего не найдено');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Ошибка загрузки данных');
                setLoading(false);
            });
    }, [user_request, serverUrl]);

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
                <title>Поиск</title>
            </Helmet>
            <div className="SearchPage-title">
                <h2 style={{ marginBottom: '10px' }}>Поиск книг</h2>
                <p>Вот что нам удалось найти по вашему запросу</p>
            </div>
            { loading ? (
                <p style={{
                    marginTop: '160px'
                }}>Загрузка...</p>
            ) : error ? (
                <p style={{
                    marginTop: '160px'
                }}>{error}</p>
            ) : (
                <Slider {...settings} className="slider-margin-books" style={{
                    marginTop: '160px'
                }}>
                    {books.map((book, index) => (
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
                </Slider>
            )}
        </div>
    );
}

export default SearchPage;
