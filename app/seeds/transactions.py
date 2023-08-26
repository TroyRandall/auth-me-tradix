from app.models import db, Transaction, environment, SCHEMA
from datetime import datetime

def seed_transactions():
    seed_data = [
        {
            'user_id': 1,
            'symbol': 'TSLA',
            'transaction_type':'buying',
            'price': 123.5,
            'quantity': 40,
            'transaction_time': datetime.utcnow()
        },
        {
            'user_id': 1,
            'symbol': 'GOOGL',
            'transaction_type': 'buying',
            'price': 300.2,
            'quantity': 20,
            'transaction_time': datetime.utcnow(),
        },
        {
            'user_id': 1,
            'symbol': 'AAPL',
            'transaction_type': 'buying',
            'price': 100.45,
            'quantity': 50,
            'transaction_time': datetime.utcnow(),
        }
    ]

    for i in seed_data:
        db.session.add(Transaction(**i))

    db.session.commit()

def undo_transactions():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.transactions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM transactions")

    db.session.commit()
