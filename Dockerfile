FROM mhart/alpine-node:4.5

ADD package.json ./package.json

RUN npm i

ADD ./app.js ./app.js
ADD ./parser.js ./parser.js
ADD ./location.js ./location.js

CMD ["node", "app.js"]
