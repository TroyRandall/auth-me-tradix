from flask.cli import AppGroup
from .users import seed_users, undo_users
from .portfolio import seed_portfolios, undo_portfolios
from .watchlist import seed_watchlists, undo_watchlists
from .transactions import seed_transactions, undo_transactions
from .stockSymbols import seed_stock_symbols, undo_stock_symbol
from .news import seed_news, undo_news
from .watchlist_stocks import seed_watchlist_stocks, undo_watchlist_stocks
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_news()
        undo_portfolios()
        undo_stock_symbol()
        undo_transactions()
        undo_watchlists()
        undo_watchlist_stocks()

    seed_users()
    seed_news()
    seed_portfolios()
    seed_stock_symbols()
    seed_transactions()
    seed_watchlists()
    seed_watchlist_stocks()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_news()
    undo_portfolios()
    undo_stock_symbol()
    undo_transactions()
    undo_watchlist_stocks()
    undo_watchlists()
    # Add other undo functions here
