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

#update wathclist
@watchlist_routes.route('/<int:watchlist_id>', methods=['PUT'])
@login_required
def update_watchlist(watchlist_id):
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    update_watchlist = Watchlist.query.get(watchlist_id)
    if update_watchlist:
        if update_watchlist.user_id == current_user_id:
            data = request.get_json()
            update_watchlist.name = data['name']
            db.session.commit()
            return update_watchlist.to_dict(), 200
        else:
            return {'error': {
                'message': 'Forbidden',
                'statusCode': 403
            }}, 403
    else:
        return{'error': {
            'message': 'Wathclist does not exist',
            'statusCode': 404
        }}, 404

#delete a wathclist
@watchlist_routes.route('/<int:watchlist_id>', methods=['DELETE'])
def delete_watchlist(watchlist_id):
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    delete_watchlist = Watchlist.query.get(watchlist_id)
    if delete_watchlist:
        if delete_watchlist.user_id == current_user_id:
            db.session.delete(delete_watchlist)
            db.session.commit()
            return {'message': 'Successfully delete'}
        else:
            return {'error': {
                'message': 'Forbidden',
                'statusCode': 403
            }}, 403
    else:
        return {'error': {
            'message': 'Can not find watchlist',
            'statusCode': 404
        }}, 404
