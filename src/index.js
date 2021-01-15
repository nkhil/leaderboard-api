const express = require('express');
const cors = require('cors');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const { port } = require('./config');
const database = require('./lib/database')
const middleware = require('./middleware')
const bodyParser = require('body-parser');
const http = require('http');

const app = express()
// app.set('views', './src/views')
// app.use(express.static('./public'))
// app.engine('html', require('ejs').renderFile)
const apiSpec = path.join(__dirname, `../openapi/openapi.yml`);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());

// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }));



(async function init() {
  await database.connect();
  app.use(
    OpenApiValidator.middleware({
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
        }
      },
    }),
  );

  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  http.createServer(app).listen(port);
  console.log(`Listening on port ${port}`);
})();

// await new OpenApiValidator({
//   apiSpec,
//   validateResponses: true,
//   operationHandlers: path.join(__dirname, './handlers'),
//   validateSecurity: {
//     handlers: {
//       verifyApiKey(req, scopes) {
//         return middleware.verifyApiKey(req)
//       },
//       bearerAuth(req, scopes) {
//         return middleware.verifyToken(req)
//       }
//     },
//   },
// }).install(app)

// app.use((err, _, res) => {
//   res.status(err.status || 500).json({
//     message: err.message,
//     errors: err.errors,
//   });
// });

// app.listen(config.port, () => console.log(`Listening on ${config.port}`))