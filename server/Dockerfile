FROM registry.gitlab.com/alienspaces/nest-mud/node:14.17.3-alpine3.14

COPY . /app
WORKDIR /app

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]
