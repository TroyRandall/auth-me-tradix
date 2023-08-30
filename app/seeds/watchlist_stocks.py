from app.models import db, Watchlist_Stock, environment, SCHEMA

def seed_watchlist_stocks():
    stock1 = Watchlist_Stock(
        watchlist_id=1,
        stock_symbol = 'AAPL'
    )
    stock2 = Watchlist_Stock(
        watchlist_id=1,
        stock_symbol = 'TSLA'
    )
    stock3 = Watchlist_Stock(
        watchlist_id=2,
        stock_symbol = 'AMD'
    )
    stock4 = Watchlist_Stock(
        watchlist_id=2,
        stock_symbol = 'NVDA'
    )
    stock5 = Watchlist_Stock(
        watchlist_id=3,
        stock_symbol = 'MSFT'
    )
    db.session.add(stock1)
    db.session.add(stock2)
    db.session.add(stock3)
    db.session.add(stock4)
    db.session.add(stock5)


    db.session.commit()

def undo_watchlist_stocks():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.watchlist_stocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlist_stocks")

    db.session.commit()
