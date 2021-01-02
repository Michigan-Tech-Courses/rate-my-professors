FROM node:13

WORKDIR /usr/app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn run build

CMD ["yarn", "start"]
