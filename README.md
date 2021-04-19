![example workflow name](https://github.com/nkhil/leaderboard-api/workflows/Node.js%20CI/badge.svg?branch=master)

# Leaderboard API

## Setup

### Local development

You will need an `.env` file with the following:

```bash
MONGO_CONNECTION_STRING=your-mongo-atlas-connection-string
```

```bash
npm install
npm run develop # npm run dev also works
```

## Tests

To run the tests using Docker

```bash
npm run test:docker
```
