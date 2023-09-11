from .apiKey import key
from flask import Blueprint, jsonify
import requests

news_routes = Blueprint('news', __name__)

@news_routes.route('/')
def get_all_news():
    url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey={key}&sort=LATEST'
    r = requests.get(url)
    data = r.json()
    if "feed" in data:
        feed = data["feed"]
        article_data = [{"source": article["source"], "title": article["title"],
                        "image": article["banner_image"], "url": article["url"],
                         "tickers": [stock["ticker"] for stock in article["ticker_sentiment"]]} for article in feed if "banner_image" in article and article["banner_image"]]

        return jsonify(article_data[:25])
    else:
        return jsonify({"error": "No news found at the moment"}), 500
@news_routes.route("/<string:ticker>")
def get_news_by_ticker(ticker):
      url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey={key}&tickers={ticker}&sort=LATEST'
      r = requests.get(url)
      data = r.json()
      if "feed" in data:
            feed = data["feed"]
            article_data = [{"source": article["source"], "title": article["title"],
                         "image": article["banner_image"], "url": article["url"],
                         "tickers": [stock["ticker"] for stock in article["ticker_sentiment"]]} for article in feed if "banner_image" in article and article["banner_image"]]
            return jsonify(article_data[:5])
      else:
            return jsonify({"error": "No news found at the moment"}), 500
