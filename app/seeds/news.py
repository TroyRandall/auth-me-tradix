from app.models import db, News, environment, SCHEMA
from datetime import datetime

def seed_news():
    seed_data = [
        {
          'user_id': 1,
          'article_link': 'https://finance.yahoo.com/m/1ae40d76-bebb-36fe-b08f-8521d47f0351/looking-for-winners-as-market.html',
          'title': 'Google Stock Leads 5 Near Buy Points.',
          'source': 'Yahoo Finance',
          'image': 'https://compote.slate.com/images/01fa8cc2-3ae8-4054-8de7-d96e5128af0d.jpeg?crop=5507%2C3671%2Cx0%2Cy0&width=2200',
          'ticker': 'GOOGL'
        },
        {
            'user_id': 1,
            'article_link': "https://www.fool.com/investing/2023/08/26/great-news-for-apple-stock-investors/",
            'title': "Great News For Apple Stock Investors",
            'source': "The Motley Fool",
            'image': "https://www.ft.com/__origami/service/image/v2/images/raw/https%3A%2F%2Fd1e00ek4ebabms.cloudfront.net%2Fproduction%2Fc13a5b78-eed1-4da0-8b42-fdb0643062ad.jpg?dpr=2&fit=scale-down&quality=medium&source=next&width=700",
            'ticker': "AAPL"
        },
        {
            'user_id': 3,
            'article_link': 'https://www.fool.com/investing/2023/08/24/can-tesla-stock-hit-300-by-the-end-of-2023/',
            'title': 'Can Tesla Stock Hit $300 by the end of 2023',
            'source': 'The Motley Fool',
            'image': 'https://ca-times.brightspotcdn.com/dims4/default/b2f3018/2147483647/strip/true/crop/5333x3555+0+0/resize/1200x800!/format/webp/quality/80/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fa8%2Fe1%2Fe67cf43841b0af9a41ae65e4a7a9%2Fgettyimages-1164576448.jpg',
            'ticker': 'TSLA'
        }
    ]
    for d in seed_data:
        db.session.add(News(**d))

    db.session.commit()

def undo_news():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.news RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM news")

    db.session.commit()
