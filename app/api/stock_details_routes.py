from .apiKey import key
from flask import Blueprint, jsonify, request
import requests
from sqlalchemy import case
from app.models import StockSymbol

stock_routes = Blueprint('stocks', __name__)

@stock_routes.route('/daily/<ticker>')
def stock_details(ticker):
    url =f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data

@stock_routes.route('/weekly/<ticker>')
def stock_details_weekly(ticker):
    url =f'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data

@stock_routes.route('/monthly/<ticker>')
def stock_details_monthly(ticker):
    url =f'https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data

@stock_routes.route('/company/<ticker>')
def company_data(ticker):
    url =f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data

@stock_routes.route('/<ticker>')
def stock_ticker_details(ticker):
    url =f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={ticker}&apikey={key}'
    r = requests.get(url)
    data = r.json()
    return data

''''i am testing this'''
# @stock_routes.route('/get-data/<string:ticker>')
# def get_data(ticker):
#     func = request.args.get('func') or 'daily'
#     url = f'https://www.alphavantage.co/query?function={"TIME_SERIES_DAILY" if func == "daily" else "TIME_SERIES_INTRADAY"}&symbol={ticker}&apikey={key}&outputsize=full{"&interval=5min" if func == "minutely" else ""}'

#     res = requests.get(url).json()
#     return res


@stock_routes.route('/search/<string:keyword>')
def search_symbols(keyword):
    try:
        alpha_vantage_url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={key}'
        alpha_vantage_response = requests.get(alpha_vantage_url)
        alpha_vantage_data = alpha_vantage_response.json()

        # Fetch data from your local database
        db_results = StockSymbol.query.filter(
            StockSymbol.symbol.ilike(f'%{keyword}%') |
            StockSymbol.company.ilike(f'%{keyword}%')
        ).order_by(
            case(
                (StockSymbol.symbol.startswith(keyword), 0),
                (StockSymbol.company.startswith(keyword), 1),
                else_=2
            )
        ).limit(7)
        db_data = [{'symbol': item.symbol, 'name': item.company} for item in db_results]

        # Combine and return the results from both sources
        result = {
            'alpha_vantage_data': alpha_vantage_data,
            'database_data': db_data
        }

        return jsonify(result)
    except Exception as e:
        print(f"Error searching symbols: {e}")
        return jsonify({'error': 'An error occurred while searching symbols'}), 500
#    try:
#         url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={keyword}&apikey={key}'
#         r = requests.get(url)


#     result = [{'symbol': item.symbol, 'name': item.company} for item in StockSymbol.query.filter(StockSymbol.symbol.ilike(f'%{keyword}%') | StockSymbol.company.ilike(
#         f'%{keyword}%')).order_by(case((StockSymbol.symbol.startswith(keyword), 0), (StockSymbol.company.startswith(keyword), 1), else_=2)).limit(7)]
#     print(keyword)
#     return jsonify(result)
