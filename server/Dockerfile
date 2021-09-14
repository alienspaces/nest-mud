FROM registry.gitlab.com/alienspaces/nest-mud/postgres:12.7-alpine3.14

RUN apk add --update nodejs npm yarn

COPY . /app
WORKDIR /app

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]
