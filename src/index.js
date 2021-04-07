const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const bodyParser = require('body-parser');
const database = require('./lib/database');
const middleware = require('./middleware');
const { countRequests } = require('./helpers/countRequests');

const app = express();

const apiSpec = path.join(__dirname, '../openapi/openapi.yml');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use('/swagger', express.static(apiSpec));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.on('finish', () => {
    countRequests({
      request: req,
      statusCode: res.statusCode,
    });
  });
  next();
});

async function init() {
  await database.connect();

  app.use(
    OpenApiValidator.middleware({
      apiSpec,
      validateResponses: true,
      operationHandlers: path.join(__dirname, './handlers'),
      validateSecurity: {
        handlers: {
          verifyApiKey(req) {
            return middleware.verifyApiKey(req);
          },
          bearerAuth(req) {
            return middleware.verifyToken(req);
          },
        },
      },
    }),
  );

  app.use((err, req, res) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  return app;
}

module.exports = init;
