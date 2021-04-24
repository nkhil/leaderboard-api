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

To run the tests using Docker:

```bash
npm run test:docker
```
