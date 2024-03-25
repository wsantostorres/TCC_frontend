FROM node:18.17.0

WORKDIR /front-end/simt/

COPY package*.json ./

RUN npm install

COPY . .

COPY .env .env

EXPOSE 3000

ENV TOKEN_BASIC=dXNlcjpwYXNzd29yZA==
ENV REACT_APP_BACKEND_URL=http://backend-container:8080
ENV REACT_APP_ORIGIN=http://frontend-container:3000

CMD ["npm", "start"]