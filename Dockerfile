FROM node:12-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src src
COPY openapi openapi
COPY index.js index.js
ENV PORT=8080

ARG MONGO_CONNECTION_STRING
ENV MONGO_CONNECTION_STRING=$MONGO_CONNECTION_STRING
ARG TOKEN_SECRET
ENV TOKEN_SECRET=$TOKEN_SECRET

# test step
FROM base as test
COPY test test

# production step
FROM base as production
WORKDIR /usr/src/app
COPY --from=base usr/src/app .

EXPOSE 8080
CMD ["node", "."]
