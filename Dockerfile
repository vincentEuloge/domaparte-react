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

FROM nginx:1.19.7-alpine AS production

COPY --from=pre-production /app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
ENTRYPOINT ["nginx","-g","daemon off;"]
