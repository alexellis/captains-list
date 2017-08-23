FROM node:6.11.2-alpine
RUN apk --no-cache add ca-certificates

ADD package.json ./package.json

RUN npm i

ADD ./*.js ./

ENTRYPOINT ["node", "app.js"]
