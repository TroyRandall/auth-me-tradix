from .db import db, environment, SCHEMA
from datetime import datetime

class StockSymbol(db.Model):
    __tablename__='stock_symbols'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(5), nullable=False, unique=True)
    company = db.Column(db.String(50), nullable = False, unique = True)
    curr_price = db.Column(db.Float, nullable = False)
    created_at = db.Column(db.Date, default = datetime.now)
    updated_at = db.Column(db.Date, default = datetime.now)
