from .db import db, add_prefix_for_prod
from datetime import datetime

# watchlist_assets = db.Table(
#     'watchlist_assets',
#     db.Column("asset_id", db.Integer, db.ForeignKey("assets.id"), primary_key=True),
#     db.Column("watchlist_id", db.Integer, db.ForeignKey("watchlists.id"), primary_key=True)
# )
class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    created_at = db.Column(db.Date, default = datetime.now)
    updated_at = db.Column(db.Date, default = datetime.now)

    user=db.relationship('User', back_populates='watchlists')
    watchlist_stocks = db.relationship("Watchlist_Stock",
                             back_populates="watchlist",
                             cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'watchlist_stocks': [stock.to_dict() for stock in self.watchlist_stocks],
            # 'watchlist_assets': watchlist_assets
        }
