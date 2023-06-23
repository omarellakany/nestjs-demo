FROM node:14-alpine

WORKDIR /app

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . .

CMD ["npm", "run", "migrate:up"]