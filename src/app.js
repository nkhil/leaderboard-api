const express = require('express');
const cors = require('cors');
const path = require('path');
const { OpenApiValidator } = require('express-openapi-validator');
const config = require('./config');
const database = require('./lib/database')

const app = express();
const apiSpec = path.join(__dirname, `../definitions/${config.name}.yml`);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async function databaseInit() {
  await database.connect();
})();

new OpenApiValidator({
  apiSpec,
  validateResponses: true,
  operationHandlers: path.join(__dirname, './handlers'),
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
