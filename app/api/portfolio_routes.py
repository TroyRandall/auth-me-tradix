from flask import Blueprint, request
from app.models import Portfolio, db, User
from app.forms.sell_portfolio import PortfolioSellForm
from app.forms.delete_portfolio import PortfolioDeleteForm
from app.forms import PortfolioForm
from flask_login import login_required, current_user
from datetime import datetime

portfolio_routes = Blueprint("portfolio", __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f"{field} : {error}")
    return errorMessages


@portfolio_routes.route("/<user_id>")
def portfolio_details(user_id):
    userPortfolio = Portfolio.query.filter(Portfolio.user_id == user_id).all()
    return {user_id: [portfolio.to_dict() for portfolio in userPortfolio]}


@portfolio_routes.route("/<int:id>", methods=["POST"])
@login_required
def portfolio_add(id):
    currentUser = User.query.get(current_user.id)
    print(currentUser)
    form = PortfolioForm()
    print(form.data)
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate():
        newPortfolio = Portfolio(
            user_id=id,
            symbol=form.data["symbol"],
            name=form.data["symbol"],
            quantity=form.data["quantity"],
            avg_price=form.data["avg_price"],
        )
        currentUser.buying_power = currentUser.buying_power - (
            form.data["avg_price"] * form.data["quantity"]
        )
        db.session.add(newPortfolio)
        db.session.commit()
        return newPortfolio.to_dict()
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@portfolio_routes.route("/<int:id>", methods=["PUT"])
@login_required
def portfolio_update(id):
    currentUser = User.query.get(current_user.id)
    form = PortfolioSellForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate():
        print(form.data['id'])
        userPortfolio = Portfolio.query.get(form.data['id'])
        print(userPortfolio.to_dict())
        if userPortfolio:
            if userPortfolio.quantity > form.data["quantity"]:
                newPortfolio = Portfolio(
                    user_id=id,
                    symbol=form.data["symbol"],
                    name=form.data["symbol"],
                    quantity=userPortfolio.quantity - form.data['quantity'],
                    avg_price=userPortfolio.avg_price,
                    created_at=userPortfolio.created_at,
                )
                userPortfolio.quantity = form.data["quantity"]
                userPortfolio.sold_at = datetime.now()
                currentUser.buying_power = currentUser.buying_power + (
                    form.data["avg_price"] * form.data["quantity"]
            )
                db.session.add(newPortfolio)
                db.session.commit()
                return {'portfolios': [newPortfolio.to_dict(), userPortfolio.to_dict()]}
            else:
                userPortfolio.quantity = 0
                userPortfolio.sold_at = datetime.now()
                currentUser.buying_power = currentUser.buying_power + (
                    form.data["avg_price"] * form.data["quantity"]
            )
            allPortfolios = Portfolio.query.filter(Portfolio.user_id == userPortfolio.user_id)
            db.session.commit()
            return {id: [portfolio.to_dict() for portfolio in allPortfolios]}
        else:
            return {"errors": "Portfolio does not exist"}
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@portfolio_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def portfolio_delete(id):
    currentUser = User.query.get(current_user.id)
    form = PortfolioDeleteForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate():
        userPortfolios = Portfolio.query.filter(Portfolio.user_id == id).all()
        if userPortfolios:
           [db.session.delete(portfolio) for portfolio in userPortfolios]
           db.session.commit()
           currentUser.buying_power = currentUser.buying_power + form.data['value']
           return {'message': 'Successfully delete'}
        else: return {'error': 'Unable to Locate Any Portfolios Related To This Account'}
    if form.errors:
        return {'error': form.errors}
