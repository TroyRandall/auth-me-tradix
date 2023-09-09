import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';

import {getArticlesFromDb} from '../../store/news';
import './GetAllNews.css'

const AllNews = () => {
    const [articles, setArticles] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getArticlesFromDb());
        fetch("/api/news").then(r => r.json()).then(r => r.error ? setArticles([{ tickers: [] }]) : setArticles(r));
    }, []);

    return (
        <div className="news-container">
            <div id="news-heading-container">
                <div className="news-heading">News</div>
            </div>
            {articles.map(article => {
                return (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" >
                        <div id="all-news-container">
                            <div id="all-news-inner-container">
                                <div id="all-news-source-container">
                                    <div id="all-news-source">
                                        {article.source}                                    </div>
                                </div>
                                <div id="all-news-bottom-half">
                                    <div id="all-news-title-and-tickers">
                                        <div id="all-news-article-title">
                                            {article.title}
                                        </div>
                                        <ul id="all-news-ticker-container">
                                            {article.tickers?.slice(0, 3)?.map(ticker => <li key={ticker}>{ticker}</li>)}
                                        </ul>
                                    </div>
                                    <div>
                                        <div>
                                            <div className="news-image-container">
                                                <img src={article.image} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
};
export default AllNews
