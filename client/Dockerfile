FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN apk --no-cache add curl

CMD ["npm", "run", "dev"]
