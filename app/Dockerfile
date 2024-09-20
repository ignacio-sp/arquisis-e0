FROM node:18

WORKDIR /.

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "run", "start"]

