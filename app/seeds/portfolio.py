from app.models import db, Portfolio, environment, SCHEMA
from datetime import datetime

def seed_portfolios():
    portfolio1 = Portfolio(
        user_id=1,
        symbol='TSLA',
        name = 'Tesla',
        quantity=100,
        avg_price=(120 * 100) / 1,
        created_at= datetime(2023, 3, 12)

    )
    portfolio2 = Portfolio(
        user_id=1,
        symbol='GME',
        name='Game Stop',
        quantity = 50,
        avg_price=(35*50)/50,
        created_at= datetime(2023, 4, 22)
    )
    portfolio3 = Portfolio(
        user_id=1,
        symbol='AAPL',
        name='Apple',
        quantity = 20,
        avg_price=(112 * 20) / 20,
        created_at= datetime(2023, 8, 14)
    )
    portfolio4 = Portfolio(
        user_id=2,
        symbol='F',
        name='Ford',
        quantity = 200,
        avg_price = (6 * 200) / 200,
        created_at= datetime(2023, 6, 6)
    )
    portfolio5 = Portfolio(
        user_id=3,
        symbol='SPY',
        name='S&P 500',
        quantity = 66,
        avg_price = (300 * 66) / 66,
        created_at= datetime(2023, 6, 6)
    )

    portfolio6 = Portfolio(
        user_id=3,
        symbol='AAPL',
        name='Apple',
        quantity = 20,
        avg_price=(112 * 20) / 20,
        created_at= datetime(2023, 6, 6)
    )

    portfolio7 = Portfolio(
        user_id=1,
        symbol='TSLA',
        name = 'Tesla',
        quantity=100,
        avg_price=(120 * 100) / 100,
        created_at= datetime(2023, 6, 6)
    )

    portfolio8 = Portfolio(
        user_id=1,
        symbol='FORD',
        name = 'Ford',
        quantity=35,
        avg_price=(29 * 100) / 100,
        created_at= datetime(2023,7,10)
    )

    portfolio9 = Portfolio(
        user_id=1,
        symbol='GM',
        name = 'General Motors',
        quantity=100,
        avg_price=(19 * 100) / 100,
        created_at= datetime(2023,5,29)
    )



    db.session.add(portfolio1)
    db.session.add(portfolio2)
    db.session.add(portfolio3)
    db.session.add(portfolio4)
    db.session.add(portfolio5)
    db.session.add(portfolio6)
    db.session.add(portfolio7)
    db.session.add(portfolio8)
    db.session.add(portfolio9)
    db.session.commit()


def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM portfolios")

    db.session.commit()
