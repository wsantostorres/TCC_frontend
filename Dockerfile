FROM node:18.17.0

WORKDIR /front-end/simt/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]