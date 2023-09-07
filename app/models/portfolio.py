from .db import db, add_prefix_for_prod, SCHEMA, environment
from datetime import datetime

class Portfolio(db.Model):
    __tablename__ = "portfolios"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer,
                        db.ForeignKey(add_prefix_for_prod("users.id")),
                        nullable=False)
    symbol = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable = False)
    quantity = db.Column(db.Float, nullable=False)
    avg_price = db.Column(db.Float, nullable=False)
    sold_at = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.Date, default = datetime.now)
    updated_at = db.Column(db.Date, default = datetime.now)

    user = db.relationship("User", back_populates="portfolios")

    def to_dict(self):
        return {
            'symbol': self.symbol,
            'name': self.name,
            'quantity': self.quantity,
            'avgPrice': self.avg_price,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'sold_at': self.sold_at,
        }
