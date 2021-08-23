![main-workflow](https://github.com/nkhil/leaderboard-api/workflows/Node.js%20CI/badge.svg?branch=master)

# Leaderboard API

## Setup

### Local development

You will need an `.env` file with the following environment variables:

```bash
MONGO_CONNECTION_STRING=your-mongo-atlas-connection-string
TOKEN_SECRET=your-token-secret-used-to-sign-and-verify-tokens
```

(see included `.env.example` file)

**To run the app locally:**

```bash
npm install
npm run develop # npm run dev also works
```

When running `npm run develop` locally, if you'd like the app to connect to a mongo db instance running in Docker, you will need to configure this manually. See the `docker-compose.yml` file for the service using `mongo`.

## Tests

To run all tests using Docker, please use:

```bash
npm run test:docker
```

This will spin up a an application container, a test container, and a database container to run the tests. 

## Design

### Objective

My motivation was to create a secure and fast API using nodejs while learning best practices including:

#### API design

Best practices in creating a 'sensible', performant and secure API endpoints while remaining RESTful. 

#### Understand stateless authorization using bearer tokens (JWTs)

Understanding how JWTs work. Specifically, they're not encrypted (i.e. anyone is able to read them) but only guarantee that they have not been tampered with.

#### Best practives while creating, hashing, storing and verifying user credentials (in this case, `clientId` and `clientSecret`)

The `clientSecret` is hashed using a asymetric hashing algorithm before being stored in the database. When an API user requests a new token with a `clientId` and a `clientSecret`. The `clientSecret` is hashed and compared to the value stored in the database to validate the user credentials before a valid JWT access token is issued.

#### Using swagger definitions to auto-validate requests and responses

This project uses [express-openapi-validator](https://github.com/cdimascio/express-openapi-validator#readme) to automatically validate requests and responses using an OpenAPI 3.0 specification. 

This project also uses [OpenApiValidator Middleware Options](https://github.com/cdimascio/express-openapi-validator#openapivalidator-middleware-options) to use security middleware that validates api keys (user credentials) and JWT bearer tokens.

#### Experiment with using a logging strategy to help debug quicker



#### Implement integration tests in Docker to improve confidence in features
#### Implement CI & CD using Github actions
#### Enforce by good code quality practices by enforcing conventional commits and linting rules
#### Understand rate-limiting and other application security features mentioned in the [OWASP cheat #### eet series](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
#### Understand & implement request monitoring in order to allow tiered usage based on 


### Introduction

The leaderboard API a simple REST API that helps with CRUDing (create, read, update and delete) leaderboards, players and their scores.

For the latest swagger endpoints, visit [https://api.leaderboardapi.com/swagger](https://api.leaderboardapi.com/swagger)

### Data model

