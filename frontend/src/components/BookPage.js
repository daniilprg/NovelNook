import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';

import { useState, useEffect } from 'react';

import { Helmet } from "react-helmet";

import '../assets/css/bookpage.css';

function BookPage() {
    const { title } = useParams(); // Получаем title из параметров URL

    const serverUrl = 'http://192.168.1.104:8000/';

    const navigate = useNavigate();

    const [isAuth, setIsAuth] = useState(false)
    const [isCsrf, setIsCsrf] = useState(null)
    const [book, setBook] = useState(null); // Состояние для хранения данных о книге
    const [loading, setLoading] = useState(true); // Состояние для загрузки данных
    const [error, setError] = useState(null); // Состояние для ошибок
    const [favorites, setFavorites] = useState([]); // Состояние для хранения избранных книг
    const [isFavorite, setIsFavorite] = useState(false); // Состояние для проверки, является ли книга избранной

    useEffect(() => {
        getSession()
    }, [])

    useEffect(() => {
        axios.get(`${serverUrl}api-books/books/`)
            .then(response => {
                const book = response.data.find(item => item.title === title);
                if (book) {
                    setBook(book);
                    setLoading(false);
                } else {
                    setError('Книга не найдена');
                    setLoading(false);
                }
            })
            .catch(() => {
                setError('Ошибка загрузки данных');
                setLoading(false);
            });
    }, [title, serverUrl]); // serverUrl тоже добавлен в зависимости


    useEffect(() => {
        // Получение списка избранных книг
        axios.get(`${serverUrl}api-favoritres/favorites/get/`, {
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
    }, []);

    useEffect(() => {
        if (book) {
            // Проверяем, находится ли книга в избранных
            const isBookFavorite = favorites.some(fav => fav.book_id === book.id);
            setIsFavorite(isBookFavorite);
        }
    }, [book, favorites]);

    const getSession = () => {
        axios.get(serverUrl + "api/session/", { withCredentials: true })
            .then((res) => {
                if (res.data.isAuthenticated) {
                    setIsAuth(true)
                    getCSRF()
                    return
                }

                setIsAuth(false)
                getCSRF()
            })
            .catch(err => console.error(err))
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

    const handleAddToFavorites = () => {
        if (book) {
            axios.post(serverUrl + 'api-favoritres/favorites/add/', {
                book_id: book.id,
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                },
            })
                .then(() => {
                    setFavorites([...favorites, { book_id: book.id }]); // Добавляем книгу в локальное состояние избранных
                    setIsFavorite(true); // Обновляем состояние, что книга теперь избранная
                })
                .catch((err) => {
                    console.error("Ошибка добавления в избранное:", err);
                    navigate('/login/');
                });
        }
    };

    const handleRemoveFromFavorites = () => {
        if (book) {
            axios.post(serverUrl + 'api-favoritres/favorites/remove/', {
                book_id: book.id,
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": isCsrf,
                },
            })
                .then(() => {
                    setFavorites(favorites.filter(fav => fav.book_id !== book.id)); // Удаляем книгу из локального состояния избранных
                    setIsFavorite(false); // Обновляем состояние, что книга больше не избранная
                })
                .catch((err) => {
                    console.error("Ошибка удаления из избранного:", err);
                });
        }
    };

    const handleReadOnline = async () => {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book.title}`);
        const data = await response.json();
        const bookLink = data.items[0].volumeInfo.previewLink;
        window.open(bookLink, '_blank');
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="book-info-container">
            <Helmet>
                <title>{book.title}</title>
            </Helmet>
            {book ? (
                <div className="book-info">
                    <div className="book-cover">
                        {book.cover && (
                            <img
                                src={`${serverUrl}${book.cover}`}
                                alt={book.title}
                                className="cover-image"
                                style={{
                                    borderRadius: '5px'
                                }}
                            />
                        )}
                    </div>
                    <div className="book-details">
                        <h2>{book.title}</h2>
                        <p><span style={{
                            color: '#000'
                        }}>Автор</span> <span style={{
                            color: '#594C91',
                            fontWeight: '500',
                        }}>{book.author}</span></p>
                        <h3 style={{
                            marginTop: '20px'
                        }}>О книге</h3>
                        <p style={{
                            lineHeight: '25px'
                        }}>{book.description}</p>
                        <h3 style={{
                            marginTop: '20px'
                        }}>Жанр и теги</h3>
                        <p style={{
                            lineHeight: '25px'
                        }}>{book.genre}</p>
                    </div>
                    <div className="book-buttons">
                        <div>
                            <button
                                onClick={handleReadOnline}
                                className="read-online-button"
                            >
                                Читать онлайн
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={isFavorite ? handleRemoveFromFavorites : handleAddToFavorites}
                                className="favorite-button"
                            >
                                {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                            </button>
                        </div>
                    </div>
                    </div>
                    ) : (
                <div>Книга не найдена</div>
            )}
        </div>
    );
}

export default BookPage;
