from flask_wtf import FlaskForm
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired, ValidationError

def checkValidAmount():
    def _checkValidAmount(form, field):
        if type(field.data) is float and field.data >= 0.00:
            return True
        else:
            raise ValidationError("The amount to buy cannot be less than 0")
    return _checkValidAmount

class PortfolioForm(FlaskForm):
    symbol = StringField('Symbol', [DataRequired()])
    quantity = FloatField('Quantity', [checkValidAmount()])
    avg_price = FloatField('Average Price', [DataRequired()])
