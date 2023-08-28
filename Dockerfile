
#pulling from node and python 3.9 image for a base
FROM node:12, python:3.9

##switching to react working directory
WORKDIR /react-app

##must be set during build
ENV REACT_APP_BASE_URL=https://tradix.onrender.com

##building out react app
RUN npm install
RUN npm run build

##setup flask_app
ENV ENV FLASK_APP=app
ENV FLASK_ENV=production
ENV SQLALCHEMY_ECHO=True

WORKDIR /flask_app

##install python dependencies
RUN pip install -r requirements.txt
RUN pip install psycopg2
RUN pip install alpha_vantage


##run application
CMD gunicorn app:app
