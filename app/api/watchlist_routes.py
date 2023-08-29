from flask import Flask, Blueprint, request
from flask_login import login_required, current_user
from ..models import db, Watchlist, Watchlist_Stock
from ..forms import WatchlistAddForm, AddStockForm

watchlist_routes = Blueprint('watchlists', __name__)

#Get all watchlist
@watchlist_routes.route('/')
@login_required
def get_all_watchlist():
    watchlists = Watchlist.query.all()
    print(watchlists)

    if watchlists is not None:
        return {'watchlists': [watchlist.to_dict() for watchlist in watchlists]}
    else:
        return {'message': 'No watchlists found'}

#create a watchlist
@watchlist_routes.route('/', methods=['POST'])
@login_required
def create_watchlist():
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    form = WatchlistAddForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        try:
            new_watchlist = Watchlist(
                name = form.data['name'],
                user_id = current_user_id
            )
            db.session.add(new_watchlist)
            db.session.commit()
            return new_watchlist.to_dict(),201
        except Exception:
            return {'error': 'there is an error in form.validate'}
    if form.errors:
        return {'errors': form.errors}
