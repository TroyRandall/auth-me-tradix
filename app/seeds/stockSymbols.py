from app.models import db, StockSymbol, environment, SCHEMA
import os

def seed_stock_symbols():

    # with open(f'{os.path.dirname(__file__)}/https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed-symbols_csv/data/595a1f263719c09a8a0b4a64f17112c6/nasdaq-listed-symbols_csv.csv', 'r') as readfile:
    #     for line in readfile.readlines()[1:]:
    #         stock_symbol, company = line.split(',')[:2]
    #         db.session.add(StockSymbol(stock_symbol=stock_symbol, company=company))

    AAPL = StockSymbol(
        symbol='AAPL',
        company='Apple',
        curr_price=178.61,
    )

    Tesla = StockSymbol(
        symbol='TSLA',
        company='Tesla',
        curr_price=238.59,
    )

    MSFT = StockSymbol(
        symbol='MSFT',
        company='Microsoft',
        curr_price=322.88,
    )

    GOOG = StockSymbol(
        symbol = 'GOOG',
        company = 'Google',
        curr_price = 130.69
    )

    AMZN = StockSymbol(
        symbol='AMZN',
        company='Amazon',
        curr_price=133.21
    )

    db.session.add(Tesla)
    db.session.add(MSFT)
    db.session.add(AAPL)
    db.session.add(GOOG)
    db.session.add(AMZN)
    db.session.commit()

def undo_stock_symbol():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.stock_symbols RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM stock_symbols")

    db.session.commit()
