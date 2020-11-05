const db = require('../lib/database/utils')
const logger = require('pino')()
const { findUserByEmail, findApiKeyHashBySalt } = require('../lib/database/utils')
const { validateHash } = require('../lib/apikey')
const { SALT_LENGTH } = require('../constants')

async function createTeam(req, res) {
  try {
    const team = req.body
    logger.info({ msg: `SCOR01_createTeam: Received POST req to create team ${JSON.stringify(team)}` })
    await db.addTeam(team)
    logger.info({ msg: `SCOR02_createTeam: Create team success` })
    res.status(201).send()
  } catch (error) {
    if (error && error.code === 11000) {
      logger.error({ msg: `SCOR_ERR01: Duplicate team record. Error: ${JSON.stringify(error)}` })
      res.status(409).send()
    }
    logger.error({ msg: `SCOR_ERR02: Unknown error. Error: ${JSON.stringify(error)}` })
  }
}

async function getTeam(req, res) {
  try {
    const { 'x-api-key': apiKey } = req.headers
    const salt = apiKey.substr(0, SALT_LENGTH)
    const [apiKeyEntry] = await findApiKeyHashBySalt(salt)
    const { apiKeyHash } = apiKeyEntry
    const apiKeyIsValid = validateHash(apiKeyHash, apiKey.slice(SALT_LENGTH))
    if (apiKeyIsValid) {
      const teams = await db.getTeams()
      res.status(200).json(teams)
    }
    res.status(401).json({ msg: 'Unauthorized request' })
  } catch (error) {
    console.log(error)
  }
}

function putTeam(req, res) {
  logger.info({ msg: `Received PUT request` })
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
