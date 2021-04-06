const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const database = require('./lib/database');
const middleware = require('./middleware');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
});

// If there is no limit on the size of requests,
// attackers can send requests with large request bodies
// that can exhaust server memory and/or fill disk space.
// For more: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html
app.use(express.json({ limit: '1kb' }));

const apiSpec = path.join(__dirname, '../openapi/openapi.yml');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(limiter);
app.use('/swagger', express.static(apiSpec));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
