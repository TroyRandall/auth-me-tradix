import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getArticlesFromDb} from '../../store/news';
import './CompanyNews.css'
// import './GetAllNews.css'
import {useParams} from 'react-router-dom';
import PlaceHolder from '../PlaceHolder'

const CompanyNews = () => {
    const [articles, setArticles] = useState([]);
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false)
    const { ticker } = useParams();
    console.log(ticker)
    useEffect(() => {
        dispatch(getArticlesFromDb())

        fetch(`/api/news/${ticker}`)
            .then(r => r.json())
            .then(r => {
                setArticles(r)
                setIsLoaded(true)
            })

    }, [ticker]);
  return(
    <div className="news-container">
            <div id="news-heading-container">
                <div className="news-heading"><span>News</span></div>
            </div>
            {isLoaded ? (
                articles.length ? articles.map(article => {
                return (
                    <a href={article.url} target="_blank" rel="noopener noreferrer" >
                        <div id="stock-news-container">
                            <div id="stock-news-inner-container">
                                <div id="stock-news-source-container">
                                    <div id="all-news-source">
                                        {article.source}
                                    </div>
                                    <div id="all-news-bottom-half" className="symbol-news-bottom-half">
                                        <div id="all-news-title-and-tickers">
                                            <div id="all-news-article-title">
                                                {article.title}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="stock-news-image-container">
                                    <img src={article.image} />
                                </div>

                            </div>
                        </div>
                    </a>
                );
            }): <div style={{padding: '1rem'}}>
                <PlaceHolder isNoData={true} /></div>
            ) : <PlaceHolder />
        }
        </div>
    );
};
export default CompanyNews;
