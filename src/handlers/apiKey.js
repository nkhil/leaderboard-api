const { generateApiKey } = require('../lib/apikey')
const { API_KEY_LENGTH, SALT_LENGTH } = require('../constants')
const { addApiKey, findApiKeyByTeamId } = require('../lib/database/utils')
const { createHash, generateSalt } = require('../lib/apikey')
const { getTeam } = require('../lib/database/utils')
const logger = require('pino')()

async function getApiKey(req, res) {
  try {
    const apiKey = generateApiKey(API_KEY_LENGTH)
    const { 'x-team-id': teamId } = req.headers
    const isValidTeamId = await checkIfTeamExists(teamId)
    if (!teamId || !isValidTeamId) {
      return res.status(400).json({ msg: 'invalid or missing x-team-id in header' }).end()
    }
    const apiKeyAlreadyExists = await checkIfTeamAlreadyHasApiKey(teamId)
    if (apiKeyAlreadyExists) {
      return res.status(400).json({ msg: `API key already exists for teamId ${teamId}` })
    }
    const hash = createHash(apiKey)
    const salt = generateSalt(SALT_LENGTH)
    await addApiKey({ apiKeyHash: hash, salt, teamId })
    return res.status('200').json({ apiKey: salt + apiKey })
  } catch (error) {
    logger.error({ msg: `An error occured. Error: ${JSON.stringify(error)}` })
    throw error
  }
}

async function checkIfTeamExists(teamId) {
  try {
    const team = await getTeam(teamId)
    if (team.length === 0) {
      logger.info(`No team found. Team: ${JSON.stringify(team)}`)
      return false
    }
    logger.info({ msg: `Returning ${team.lengh} team(s)` })
    return true
  } catch (error) {
    logger.error({ msg: `Error checking if team exists. ${JSON.stringify(error)}` })
    throw error
  }
}

async function checkIfTeamAlreadyHasApiKey(teamId) {
  try {
    const apiEntry = await findApiKeyByTeamId(teamId)
    console.log('checkIfTeamAlreadyHasApiKey -> apiEntry', apiEntry)
    if (apiEntry.length === 0) return false
    return true
  } catch (error) {
    logger.error({ msg: `Error checking if team already has API key. ${JSON.stringify(error)}` })
    throw error
  }
}

module.exports = {
  getApiKey,
}
