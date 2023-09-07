from flask import Flask, Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Watchlist, Watchlist_Stock
from ..forms import WatchlistAddForm, AddStockForm

watchlist_routes = Blueprint('watchlists', __name__)

#Get all watchlist
@watchlist_routes.route('/')
@login_required
def get_all_watchlist():
    watchlists = Watchlist.query.all()
    print( watchlists)

    if watchlists is not None:
        return {'watchlists': [watchlist.to_dict() for watchlist in watchlists]}
    else:
        return {'message': 'No watchlists found'}

@watchlist_routes.route('/current')
@login_required
def user_watchlists():
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    user_watchlists = Watchlist.query.filter(Watchlist.user_id == current_user_id).all()
    watchlists_data = [watchlist.to_dict() for watchlist in user_watchlists]

    return jsonify({'watchlists': watchlists_data})

#create a watchlist(done)
@watchlist_routes.route('/', methods=['POST'])
@login_required
def create_watchlist():
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    form = WatchlistAddForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        try:
            new_watchlist = Watchlist(
                name = form.data['name'],
                user_id = current_user_id
            )
            db.session.add(new_watchlist)
            db.session.commit()
            return new_watchlist.to_dict()
        except Exception:
            return {'error': 'there is an error' }
    if form.errors:
        return {'error': form.errors}




#update wathclist(done)
@watchlist_routes.route('/<int:watchlist_id>', methods=['PUT'])
@login_required
def update_watchlist(watchlist_id):
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    update_watchlist = Watchlist.query.get(watchlist_id)

    form = WatchlistAddForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        if update_watchlist.user_id == current_user_id:

            new_name = form.data['name']
            print(new_name)

            existing_watchlist = Watchlist.query.filter(
                Watchlist.name == new_name,
                Watchlist.id != watchlist_id
            ).first()

            if existing_watchlist:
                return {'error': 'Watchlist name already exists'}, 400

            update_watchlist.name = new_name
            db.session.commit()
            return update_watchlist.to_dict(), 200
        else:
            return {'error': {
                'message': 'Forbidden',
                'statusCode': 403
            }}, 403

    if form.errors:
        return {'error': form.errors}, 400



#delete a wathclist(done)
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

#add a stock to wathclist(done)
@watchlist_routes.route('<int:watchlist_id>/stocks', methods=['POST'])
@login_required
def add_stock_to_watchlist(watchlist_id):
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    watchlist = Watchlist.query.get(watchlist_id)
    if not watchlist:
        return {'error': {
            'message': 'Cannot find watchlist',
            'statusCode': 404
        }}
    if watchlist.user_id != current_user_id:
        return {'error': {
            'message': 'Forbidden',
            'statusCode': 403
        }}
    form = AddStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate():
        symbol = form.data['symbol']
        if symbol in [i.stock_symbol for i in watchlist.watchlist_stocks]:
            return {
                'error': {
                    'message': 'Stock already exist in this list',
                    'statusCode': 403
                }
            }, 403
        try:
            new_stock = Watchlist_Stock(
                watchlist_id = watchlist_id,
                stock_symbol = form.data['symbol']
            )
            db.session.add(new_stock)
            db.session.commit()
            return new_stock.to_dict(), 200
        except Exception:
            return {'error': 'there is an error'}
    if form.errors:
        return {'error': form.errors}

#delete a stock from watchlist
@watchlist_routes.route('/stocks/<int:stock_id>', methods=['DELETE'])
@login_required
def delete_stock(stock_id):
    current_user_info = current_user.to_dict()
    current_user_id = current_user_info['id']
    delete_stock = Watchlist_Stock.query.get(stock_id)
    if not delete_stock:
        return {'error': {
            'message': 'Cannot find this stock in this watchlist',
            'statusCode': 404
        }}, 404
    watchlist = Watchlist.query.get(delete_stock.watchlist_id)
    if watchlist.user_id != current_user_id:
        return{'error': {
            'message': 'Forbidden',
            'statusCode': 403
        }}, 403
    db.session.delete(delete_stock)
    db.session.commit()
    return {'message': 'Stock has been deleted successfully'}
