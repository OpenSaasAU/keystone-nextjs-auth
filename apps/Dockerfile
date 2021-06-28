
FROM node:16.1-alpine AS deps
ARG APP=next-app
WORKDIR /usr/app
COPY ".npmrc" .
COPY ["./apps/${APP}/package.json", "yarn.lock", "./"]
RUN yarn install
ENV NODE_ENV=production
COPY ./apps/${APP}/. .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
