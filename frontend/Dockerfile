FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm i 

COPY . .

CMD ["npm", "run", "start:dev"]
