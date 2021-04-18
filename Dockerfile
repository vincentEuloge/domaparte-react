FROM node:14.15.3-alpine3.12 AS development
LABEL name 'The Best App'

RUN apk update && apk upgrade

RUN mkdir /app/
WORKDIR /app/


FROM development AS install

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

COPY  /src/ /app/src/


FROM install AS lint

COPY .eslintrc.json /app/.eslintrc.json
COPY tsconfig.json /app/tsconfig.json

CMD npm run lint


FROM lint AS pre-production

COPY /public/ /app/public/
COPY .env /app/.env
RUN npm run build


FROM node:14.15.3-alpine3.12 AS production

ARG REACT_APP_TEMPERATURES_API_URL
ENV REACT_APP_TEMPERATURES_API_URL=$REACT_APP_TEMPERATURES_API_URL

RUN mkdir /app/
WORKDIR /app/
COPY --from=pre-production /app/build/ .

RUN npm install -g serve

EXPOSE 5000
CMD serve
