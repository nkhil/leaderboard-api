const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenApiValidator } = require('express-openapi-validator');
const config = require('./config');
const database = require('./lib/database')
const middleware = require('./middleware')

const app = express()
app.set('views', './src/views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
const apiSpec = path.join(__dirname, `../openapi/openapi.yml`)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

(async function init() {
  await database.connect();
  await new OpenApiValidator({
    apiSpec,
    validateResponses: true,
    operationHandlers: path.join(__dirname, './handlers'),
    validateSecurity: {
      handlers: {
        verifyApiKey(req, scopes) {
          return middleware.verifyApiKey(req)
        },
        bearerAuth(req, scopes) {
          return middleware.verifyToken(req)
        }
      },
    },
  }).install(app)

  app.use((err, _, res) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  app.listen(config.port, () => console.log(`Listening on ${config.port}`))
})();
