from .db import db
from .user import User
from .watchlist import Watchlist
from .portfolio import Portfolio
from .watchlist_stock import Watchlist_Stock
from .news import News
from .stockSymbol import StockSymbol
from .transaction import Transaction
from .db import environment, SCHEMA
from sqlalchemy.orm import relationship



# class Asset(db.Model):
#     __tablename__ = 'assets'

#     id = db.Column(db.Integer, primary_key=True)
#     symbol = db.Column(db.String(4), nullable=False, unique=True)

#     watched_stocks = db.relationship('Watchlist', secondary=watchlist_assets, lazy="subquery", backref=db.backref('watchlist_assets', lazy=True))

#     transactions = relationship("Transaction")
#     portfolios = relationship("Portfolio")
