const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenApiValidator } = require('express-openapi-validator');
const config = require('./config');
const database = require('./lib/database')
const middleware = require('./middleware/verifyApiKey')

const app = express()
app.set('views', './src/views')
app.use(express.static('./public'))
app.engine('html', require('ejs').renderFile)
const apiSpec = path.join(__dirname, `../definitions/${config.name}.yml`)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Initialise database
(async function databaseInit() {
  await database.connect();
})();

// Route the request to handler
new OpenApiValidator({
  apiSpec,
  validateResponses: true,
  operationHandlers: path.join(__dirname, './handlers'),
  validateSecurity: {
    handlers: {
      verifyApiKey(req, scopes) {
        return middleware.verifyApiKey(req)
      },
    },
  },
})
  .install(app)
  .then(() => {
    app.use((err, _, res) => {
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });
  });

module.exports = app;
