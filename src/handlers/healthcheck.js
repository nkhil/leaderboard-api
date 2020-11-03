const logger = require('pino')()

function ping(_, res) {
  logger.info({ msg: 'healthcheck/ping requested' })
  res.status(200).json({ status: 'OK' });
}

module.exports = {
  ping,
}
