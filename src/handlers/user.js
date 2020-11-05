const logger = require('pino')()
const { addUser } = require('../lib/database/utils')

async function createUser(req, res) {
  try {
    logger.info({ msg: `USR01_01: Create user request received` })
    const users = req.body
    const promises = users.map(user => addUser(user))
    const usersCreated = await Promise.all(promises)
    logger.info({ msg: `USR01_02: User(s) created successfully` })
    res.status(201).send()
  } catch (error) {
    console.log('createUser -> error', error)
    if (error && error.code === 11000) {
      logger.error({ msg: `USR01_ERR01: Duplicate team record. Error: ${JSON.stringify(error)}` })
      res.status(409).send()
    }
    logger.error({ msg: `USR01_ERR02: Error creating user ${JSON.stringify(error)}` })
  }
}

function getUser(req, res) {
  logger.info({ msg: `Get user request received` })
}

module.exports = {
  createUser,
  getUser,
}
