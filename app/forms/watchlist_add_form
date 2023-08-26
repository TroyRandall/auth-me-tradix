from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, SubmitField
from wtforms.validators import DataRequired


class WatchlistAddForm(FlaskForm):
    add_to_watchlist = BooleanField('add',validators=[DataRequired()] )
    watchlist_name = StringField('Watchlist', validators=[DataRequired()])
    Submit = SubmitField("Submit")
