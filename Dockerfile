FROM node:12 AS build-stage

WORKDIR /react-app
COPY react-app/. .

ENV REACT_APP_BASE_URL=
