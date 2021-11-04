FROM node:16
ENV NODE_ENV=production
ENV SESSION_SECRET=TEMP_SESSION_SECRET20_ADDING_NOW_NEED_32_CHAR
ENV DATABASE_ADAPTER=prisma_postgresql
WORKDIR /usr/src/app
COPY ["./backend/package.json", "yarn.lock", "./"]
RUN yarn install
COPY ./backend/. .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
