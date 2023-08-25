from .db import db
from datetime import datetime

class StockSymbol(db.Model):
    __tablename__='stock_symbols'

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(5), nullable=False, unique=True)
    company = db.Column(db.String(50), nullable = False, unique = True)
    curr_price = db.Column(db.Float, nullable = False)
