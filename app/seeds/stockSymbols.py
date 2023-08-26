from app.models import db, StockSymbol, environment, SCHEMA
import os

def seed_stock_symbols():
    with open(f'{os.path.dirname(__file__)}/https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed-symbols_csv/data/595a1f263719c09a8a0b4a64f17112c6/nasdaq-listed-symbols_csv.csv', 'r') as readfile:
        for line in readfile.readlines()[1:]:
            stock_symbol, company = line.split(',')[:2]
            db.session.add(StockSymbol(stock_symbol=stock_symbol, company=company))

    db.session.commit()

def undo_stock_symbol():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.stock_symbols RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM stock_symbols")

    db.session.commit()
