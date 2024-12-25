import React from 'react';

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import NovelGPT from './components/NovelGPT';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import BookPage from './components/BookPage';

import './assets/css/App.css';
import SearchPage from "./components/SearchPage";
import CatalogPage from "./components/CatalogPage";

function Layout({ children }) {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/login/' | location.pathname === '/login';

    return (
        <div>
            {!hideHeaderFooter && <Header />}
            <main>{children}</main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
}

function App() {
    return (
        <Router>
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
            </style>
            <Layout>
            <div className="routes">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/favorites" element={<Favorites/>}/>
                    <Route path="/novelgpt" element={<NovelGPT/>}/>
                    <Route path="/book/:title" element={<BookPage />} />
                    <Route path="/search/:user_request" element={<SearchPage />} />
                    <Route path="/catalog/:user_request" element={<CatalogPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            </Layout>
        </Router>
);
}

export default App;
