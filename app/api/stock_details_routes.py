from .apiKey import key
from flask import Blueprint, jsonify
import requests

stock_routes = Blueprint('stocks', __name__)

@stock_routes.route('/daily/<ticker>')
def stock_details(ticker):
    print(ticker)
    url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    print(data['Meta Data']['2. Symbol'])
    return data

@stock_routes.route('/<ticker>')
def stock_ticker_details(ticker):
    print(ticker)
    url =f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data
