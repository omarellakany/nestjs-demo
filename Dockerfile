FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

CMD ["npm", "run", "start:migrate:prod"]

