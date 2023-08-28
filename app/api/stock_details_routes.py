from .apiKey import key
from flask import Blueprint, jsonify
import requests

stock_routes = Blueprint('stocks', __name__)

stock_routes.route('/<str:ticker>')
def stock_details(ticker):

    url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    print(url, r)
    data = r.json()
    print(data)
    return data
