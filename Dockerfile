FROM node:20

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
