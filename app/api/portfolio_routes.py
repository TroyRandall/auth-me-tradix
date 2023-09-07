from flask import Blueprint, request
from app.models import Portfolio, db, User
from app.forms.sell_portfolio import PortfolioSellForm
from app.forms import PortfolioForm
from flask_login import login_required, current_user

portfolio_routes = Blueprint('portfolio', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@portfolio_routes.route('/<user_id>')
def portfolio_details(user_id):
    userPortfolio = Portfolio.query.filter(Portfolio.user_id == user_id).all()
    return {user_id: [portfolio.to_dict() for portfolio in userPortfolio]}

@portfolio_routes.route('/<int:id>', methods=['POST'])
@login_required
def portfolio_add(id):
    currentUser = User.query.get(current_user.id)
    print(currentUser)
    form = PortfolioForm()
    print(form.data)
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        newPortfolio = Portfolio(
            user_id = id,
            symbol = form.data['symbol'],
            name = form.data['symbol'],
            quantity = form.data['quantity'],
            avg_price = form.data['avg_price'],
        )
        currentUser.buying_power = currentUser.buying_power - (form.data['avg_price'] * form.data['quantity'])
        db.session.add(newPortfolio)
        db.session.commit()
        return newPortfolio.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@portfolio_routes.route('/<int:id>', methods=['PUT'])
@login_required
def portfolio_update(id):
    currentUser = User.query.get(current_user.id)
    form = PortfolioSellForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate():
        userPortfolio = Portfolio.query.filter(Portfolio.created_at == form.data['Purchased On'])
        if userPortfolio:
            userPortfolio.sold_at = {
                'sold': form.data['sold_at'],
                'quantity': form.data['quantity'],
                'avgPrice': form.data['avg_price']}
            currentUser.buying_power = currentUser.buying_power + (form.data['avg_price'] * form.data['quantity'])
            db.session.commit()
            return userPortfolio.to_dict()
        else: return {'errors': 'Portfolio does not exist'}
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
