const logger = require('@subgeniuscorp/logger');

function ping(_, res) {
  logger.info({ msg: 'SCOR_ping: Liveness request received' });
  res.status(200).json({ status: 'OK' });
}

module.exports = {
  ping,
};
