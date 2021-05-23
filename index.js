const logger = require('@subgeniuscorp/logger');
const init = require('./src');

const { port } = require('./src/config');

(async () => {
  const app = await init();
  app.listen(port, () => {
    logger.info({ msg: `Scoring-api is listening on port ${port}` });
  });
})();
