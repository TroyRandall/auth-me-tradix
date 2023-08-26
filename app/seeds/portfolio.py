from app.models import db, Portfolio, environment, SCHEMA

def seed_portfolios():
    portfolio1 = Portfolio(
        user_id=1,
        symbol='TSLA',
        name = 'Tesla',
        quantity=100,
        avg_price=(120 * 100) / 1
    )
    portfolio2 = Portfolio(
        user_id=1,
        symbol='GME',
        name='Game Stop',
        quantity = 50,
        avg_price=(35*50)/50
    )
    portfolio3 = Portfolio(
        user_id=1,
        symbol='AAPL',
        name='Apple',
        quantity = 20,
        avg_price=(112 * 20) / 20
    )
    portfolio4 = Portfolio(
        user_id=2,
        symbol='F',
        name='Ford',
        quantity = 200,
        avg_price = (6 * 200) / 200
    )
    portfolio5 = Portfolio(
        user_id=3,
        symbol='SPY',
        name='S&P 500',
        quantity = 66,
        avg_price = (300 * 66) / 66
    )
    db.session.add(portfolio1)
    db.session.add(portfolio2)
    db.session.add(portfolio3)
    db.session.add(portfolio4)
    db.session.add(portfolio5)

def undo_portfolios():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.portfolios RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM portfolios")

    db.session.commit()
