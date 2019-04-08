FROM node:8.4-alpine

WORKDIR /usr/app
COPY . /usr/app/

ENTRYPOINT ["node", "./src/main.js"]
