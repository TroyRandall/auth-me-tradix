from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime
from werkzeug.datastructures import FileStorage

import os
# import boto3



class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    buying_power = db.Column(db.Float, default=0.00)
    image_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)



    watchlists=db.relationship('Watchlist', back_populates='user', cascade='all, delete-orphan')
    transactions = db.relationship('Transaction', back_populates='user', cascade='all, delete-orphan')
    portfolios = db.relationship('Portfolio', back_populates='user', cascade='all, delete-orphan')
    news = db.relationship('News', back_populates='user', cascade='all, delete-orphan')
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            # 'firstName': self.first_name,
            # 'lastName': self.last_name,
            'email': self.email,
            'buyingPower': self.buying_power,
            'imageUrl': self.image_url
        }

def upload_profile(self, file: FileStorage) -> str:
        filename = 'profile-image/' + self.email + str(datetime.now()) + '.' + file.filename.split('.')[-1]


        s3 = boto3.client(
            's3',
            region_name = os.environ.get('S3_REGION'),
            aws_access_key_id = os.environ.get('S3_KEY'),
            aws_secret_access_key = os.environ.get('S3_SECRET')
        )

        s3.upload_fileobj(
            file,
            os.environ.get('S3_BUCKET'),
            filename,
            ExtraArgs = {
                "ContentType": file.content_type
            }
        )

        self.image_url = f"{os.environ.get('S3_LOCATION')}/{filename}"
        db.session.commit()

        return self.image_url


# def delete_profile(self):
#         s3 = boto3.client(
#             's3',
#             region_name = os.environ.get('S3_REGION'),
#             aws_access_key_id = os.environ.get('S3_KEY'),
#             aws_secret_access_key = os.environ.get('S3_SECRET')
#         )

#         s3.delete_object(
#             Bucket=os.environ.get('S3_BUCKET'),
#             Key=self.image_url.split('amazonaws.com/')[1]
#         )

#         self.image_url = None
#         db.session.commit()

def update_un_nn(self, user_name):

        self.username = user_name

        db.session.commit()
