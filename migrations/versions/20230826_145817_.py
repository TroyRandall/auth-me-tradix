"""empty message

Revision ID: 673aa0240885
Revises: ffdc0a98111c
Create Date: 2023-08-26 14:58:17.648629

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '673aa0240885'
down_revision = 'ffdc0a98111c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('stock_symbols',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('symbol', sa.String(length=5), nullable=False),
    sa.Column('company', sa.String(length=50), nullable=False),
    sa.Column('curr_price', sa.Float(), nullable=False),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('company'),
    sa.UniqueConstraint('symbol')
    )
    op.create_table('news',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('source', sa.String(), nullable=False),
    sa.Column('image', sa.String(), nullable=False),
    sa.Column('ticker', sa.String(), nullable=True),
    sa.Column('article_link', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('portfolios',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('symbol', sa.String(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('avg_price', sa.Float(), nullable=False),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transactions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('transaction_type', sa.String(length=50), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('quantity', sa.Float(), nullable=False),
    sa.Column('symbol', sa.String(), nullable=False),
    sa.Column('transaction_time', sa.Date(), nullable=False),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('watchlists',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.Date(), nullable=True),
    sa.Column('updated_at', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('watchlist_stocks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('watchlist_id', sa.Integer(), nullable=False),
    sa.Column('stock_symbol', sa.String(length=10), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['watchlist_id'], ['watchlists.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # with op.batch_alter_table('users', schema=None) as batch_op:
    #     batch_op.add_column(sa.Column('first_name', sa.String(length=100), nullable=False))
    #     batch_op.add_column(sa.Column('last_name', sa.String(length=100), nullable=False))
    #     batch_op.add_column(sa.Column('buying_power', sa.Float(), nullable=True))
    #     batch_op.add_column(sa.Column('image_url', sa.String(), nullable=False))
    #     batch_op.add_column(sa.Column('created_at', sa.DateTime(), nullable=True))
    #     batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    # with op.batch_alter_table('users', schema=None) as batch_op:
    #     batch_op.drop_column('updated_at')
    #     batch_op.drop_column('created_at')
    #     batch_op.drop_column('image_url')
    #     batch_op.drop_column('buying_power')
    #     batch_op.drop_column('last_name')
    #     batch_op.drop_column('first_name')

    op.drop_table('watchlist_stocks')
    op.drop_table('watchlists')
    op.drop_table('transactions')
    op.drop_table('portfolios')
    op.drop_table('news')
    op.drop_table('stock_symbols')
    # ### end Alembic commands ###
