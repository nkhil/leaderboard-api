const db = require('../lib/database/utils')
const logger = require('pino')()
const { objectIdIsValid } = require('../helpers');

async function createTeam(req, res) {
  try {
    const { clientId } = req;
    const teamDetails = req.body
    const team = { clientId, ...teamDetails }
    logger.info({ msg: `TEA01_01: Received POST req to create team` })
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
    const { clientId } = req;
    const { teamId } = req.params;
    let teams;
    if (!teamId) {
      logger.info({ msg: `TEA02_02: No teamId found in params, retrieving all teams` })
      teams = await db.getTeams(clientId)
    } else {
      logger.info({ msg: `TEA01_03: teamId supplied in params. Getting team` })
      const teamIdIsValidObjectId = objectIdIsValid(teamId);
      if (!teamIdIsValidObjectId) {
        logger.info({ msg: `TEA01_04: teamId is invalid mongo ObjectId` })
        return res.status(400).send();
      }
      teams = await db.getTeam(teamId);
      if (!teams || teams.length === 0) {
        logger.info({ msg: `TEA01_05: no team found for given teamId` })
        return res.status(400).send();
      }
      console.log('🚀 ~ file: team.js ~ line 39 ~ getTeam ~ teams', teams)
    }
    return res.status(200).json(teams)
  } catch (error) {
    logger.error({ msg: `TEA01_ERR01: Error ${JSON.stringify(error)}` })
  }
}

function putTeam(req, res) {
  try {
    logger.info({ msg: `TEA03_01: Received PUT request` })
    const { teamId } = req.params
    const { clientId } = req;
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
