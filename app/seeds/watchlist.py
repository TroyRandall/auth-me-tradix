from app.models import db, Watchlist, environment, SCHEMA

def seed_watchlists():
    watchlist1 = Watchlist(
        name='ETFs Stocks',
        user_id=1
    )
    watchlist2 = Watchlist(
        name='Tech Stocks',
        user_id=2
    )
    watchlist3 = Watchlist(
        name='Fortune500 Stocks',
        user_id=3
        )
    watchlist4 = Watchlist(
        name='Small Cap Company',
        user_id=1
    )
    watchlist5=Watchlist(
        name='My Favorite Stocks',
        user_id=4
    )
    watchlist6 = Watchlist(
        name='Penny Stocks',
        user_id=5
    )
    db.session.add(watchlist1)
    db.session.add(watchlist2)
    db.session.add(watchlist3)
    db.session.add(watchlist4)
    db.session.add(watchlist5)
    db.session.add(watchlist6)
    db.session.commit()

def undo_watchlists():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM watchlists")

    db.session.commit()
