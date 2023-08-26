from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField, FloatField, SelectField
from wtforms.validators import DataRequired, ValidationError
from app.models import User

def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if not user:
        raise ValidationError('Email provided not found.')

def check_buying_power(form, field):
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user.buying_power < form.buying_power_needed :
         raise ValidationError('Not Enough Funds to Complete Transaction')

class Transaction(FlaskForm):
        email = StringField('email', validators=[DataRequired(), user_exists])
        buying_power_needed = FloatField("buying power", validators=[DataRequired(), check_buying_power])
        stock_symbol = StringField("Stock Symbol", validators = [DataRequired()])
        quantity = FloatField("Quantity", validators = [DataRequired()])
        type = SelectField('type', validators = [DataRequired()])
        Submit = SubmitField("Submit", validators =[DataRequired()])
