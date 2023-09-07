from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField
from wtforms.validators import DataRequired


class WatchlistAddForm(FlaskForm):
    name = StringField('Watchlist name', validators=[DataRequired()])
    user_id = StringField("user_id", validators = [DataRequired()])
    Submit = SubmitField("Submit")
