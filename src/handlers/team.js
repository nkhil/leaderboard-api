const db = require('../lib/database/utils')
const logger = require('pino')()
const { SALT_LENGTH } = require('../constants')

async function createTeam(req, res) {
  try {
    const team = req.body
    logger.info({ msg: `TEA01_01: Received POST req to create team ${JSON.stringify(team)}` })
    await db.addTeam(team)
    logger.info({ msg: `TEA01_02: Create team success` })
    res.status(201).send()
  } catch (error) {
    if (error && error.code === 11000) {
      logger.error({ msg: `TEA01_ERR01: Duplicate team record. Error: ${JSON.stringify(error)}` })
      res.status(409).send({ msg: `${req.body.team.teamName} already exists` })
    }
    logger.error({ msg: `TEA01_ERR02: Unknown error. Error: ${JSON.stringify(error)}` })
  }
}

async function getTeam(req, res) {
  try {
    logger.info({ msg: `TEA02_01: Received GET team req` })
    const { 'x-api-key': apiKey } = req.headers
    const salt = apiKey.substr(0, SALT_LENGTH)
    logger.info({ msg: `TEA02_02: Retrieving API key hash from DB` })
    const [apiKeyEntry] = await db.findApiKeyHashBySalt(salt)
    const { teamId } = apiKeyEntry
    logger.info({ msg: `TEA02_03: Retrieving team from DB` })
    const team = await db.getTeam(teamId)
    return res.status(200).json(team)
  } catch (error) {
    logger.error({ msg: `TEA01_ERR01: Error ${JSON.stringify(error)}` })
  }
}

function putTeam(req, res) {
  try {
    logger.info({ msg: `TEA03_01: Received PUT request` })
    const { teamId } = req.params
    
  } catch (error) {
    
  }
}

function deleteTeam(req, res) {
  logger.info({ msg: `Received DELETE request` })
}

module.exports = {
  createTeam,
  getTeam,
  putTeam,
  deleteTeam,
}
