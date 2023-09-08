from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, DateField, SubmitField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from datetime import datetime

class PortfolioSellForm(FlaskForm):
    symbol = StringField('Symbol', [DataRequired()])
    quantity = FloatField('Quantity', [DataRequired()])
    avg_price = FloatField('Average Price', [DataRequired()])
    id = IntegerField('id',[DataRequired()])
    submit = SubmitField('Submit')
