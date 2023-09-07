from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, DateField, SubmitField
from wtforms.validators import DataRequired, ValidationError


class PortfolioSellForm(FlaskForm):
    symbol = StringField('Symbol', [DataRequired()])
    quantity = FloatField('Quantity', [DataRequired()])
    purchased = DateField('Purchased On', [DataRequired()])
    avg_price = FloatField('Average Price', [DataRequired()])
    sold_at = DateField('Sold At', [DataRequired()])
    submit = SubmitField('Submit')
