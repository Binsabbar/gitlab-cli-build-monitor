FROM node:13-alpine

ADD ./package.json ./package-lock.json  /app/

WORKDIR /app
RUN npm install --only=prod
ADD ./src /app/src/
USER node

ENTRYPOINT [ "node", ".", "--file", "config.yml"]