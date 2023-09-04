from flask import Blueprint, request
from app.models import Portfolio, db
from app.forms import PortfolioForm
from flask_login import login_required

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


@portfolio_routes.route('/<int:user_id>')
# @login_required
def portfolio_details(user_id):
    userPortfolio = Portfolio.query.filter(Portfolio.user_id == user_id).all()
    return [portfolio.to_dict() for portfolio in userPortfolio]

@portfolio_routes.route('/<int:id>', methods=['POST'])
@login_required
def portfolio_add(id):
    form = PortfolioForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        newPortfolio = Portfolio(
            user_id = id,
            symbol = form.data['Symbol'],
            name = form.data['Symbol'],
            quantity = form.data['Quantity'],
            avg_price = form.data['Average Price'],
            purchaseIn = form.data['Purchase In'],
        )
        db.session.add(newPortfolio)
        db.session.commit()
        return newPortfolio
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401
