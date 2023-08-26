from .db import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    symbol = db.Column(db.String, nullable=False)
    created_at = db.Column(db.Date, default = datetime.now)
    updated_at = db.Column(db.Date, default = datetime.now)

    user = db.relationship('User', back_populates='transactions')
