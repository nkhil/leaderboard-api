const init = require('./src');
const { port } = require('./src/config');
const logger = require('pino')();

(async () => {
  const app = await init();
  app.listen(port, function () {
    logger.info({ msg: `Scoring-api is listening on port ${port}` })
  })
})()
