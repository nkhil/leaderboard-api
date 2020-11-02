FROM node:12-alpine as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY src src
COPY definitions definitions

# test step
# FROM base as test
# COPY test test

# production step
FROM base as production
WORKDIR /usr/src/app
COPY --from=base usr/src/app .
EXPOSE 8080
CMD ["node", "."]
