FROM node:14-alpine
WORKDIR /app

COPY . /app

RUN yarn install
CMD yarn dev

EXPOSE 3015

