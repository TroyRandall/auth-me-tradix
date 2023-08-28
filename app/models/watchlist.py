from .db import db
from datetime import datetime

class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.Date, default = datetime.now)
    updated_at = db.Column(db.Date, default = datetime.now)

    user=db.relationship('User', back_populates='watchlists')
    watchlist_stocks = db.relationship("Watchlist_Stock",
                             back_populates="watchlist",
                             cascade="all, delete-orphan")
