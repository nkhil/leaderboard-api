const logger = require('pino')()

function createUser(req, res) {
  logger.info({ msg: `Create user request received` })
}

function getUser(req, res) {
  logger.info({ msg: `Get user request received` })
}

module.exports = {
  createUser,
  getUser,
}
