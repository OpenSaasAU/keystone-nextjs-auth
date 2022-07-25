
FROM node:18-buster-slim AS deps
ARG APP=next-app
WORKDIR /usr/app
COPY ["./apps/${APP}/package.json", "yarn.lock", "./"]
RUN yarn install
ENV BACKEND_BASE_URL=http://demo-app-backend:3000
ENV NODE_ENV=production
COPY ./apps/${APP}/. .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
