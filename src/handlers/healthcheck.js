const logger = require('pino')()

function ping(_, res) {
  logger.info({ msg: 'SCOR_ping: Healthcheck / Ping request received' })
  res.status(200).json({ status: 'OK' });
}

module.exports = {
  ping,
}
