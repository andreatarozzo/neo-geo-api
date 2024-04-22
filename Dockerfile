FROM node:20-alpine AS builder
WORKDIR /home/node/app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:20-alpine
WORKDIR /home/node/app
COPY . .
RUN yarn install --frozen-lockfile --production && yarn cache clean
RUN yarn global add sequelize-cli
COPY --from=builder /home/node/app/dist ./dist
RUN chmod +x startup.sh
EXPOSE 4000
ENTRYPOINT [ "./startup.sh" ]