const logger = require('@subgeniuscorp/logger');
const db = require('../lib/database/utils');
const { objectIdIsValid } = require('../helpers');

async function createTeam(req, res) {
  try {
    const { clientId } = req;
    const teamDetails = req.body;
    const team = { clientId, ...teamDetails };
    logger.info({ msg: 'TEA01_01: Received POST req to create team' });
    await db.addTeam(team);
    logger.info({ msg: 'TEA01_02: Create team success' });
    res.status(201).send();
  } catch (error) {
    if (error && error.code === 11000) {
      logger.error({ msg: `TEA01_ERR01: Duplicate team record. Error: ${JSON.stringify(error)}` });
      res.status(409).send({ msg: `${req.body.team.teamName} already exists` });
    }
    logger.error({ msg: `TEA01_ERR02: Unknown error. Error: ${JSON.stringify(error)}` });
    res.status(500).send();
  }
}

function formatTeamResponse(teams) {
  const teamsAreArray = Array.isArray(teams);

  const formatSingleTeamResponse = (team) => {
    const {
      _id, teamName, leaderboardId, score,
    } = team;
    return {
      id: _id.toString(),
      teamName,
      leaderboardId: leaderboardId.toString(),
      score,
    };
  };

  if (!teamsAreArray) {
    return formatSingleTeamResponse(teams);
  }

  return teams.map((t) => formatSingleTeamResponse(t));
}

async function getTeam(req, res) {
  try {
    logger.info({ msg: 'TEA02_01: Received GET team req' });
    const { clientId } = req;
    const { teamId } = req.params;
    let teams;
    if (!teamId) {
      logger.info({ msg: 'TEA02_02: No teamId found in params, retrieving all teams' });
      teams = await db.getTeams(clientId);
      teams = formatTeamResponse(teams);
    } else {
      logger.info({ msg: 'TEA01_03: teamId supplied in params. Getting team' });
      const teamIdIsValidObjectId = objectIdIsValid(teamId);
      if (!teamIdIsValidObjectId) {
        logger.info({ msg: 'TEA01_04: teamId is invalid mongo ObjectId' });
        return res.status(400).send();
      }
      teams = await db.getTeam(teamId);
      teams = formatTeamResponse(teams);
      if (!teams || teams.length === 0) {
        logger.info({ msg: 'TEA01_05: no team found for given teamId' });
        return res.status(400).send();
      }
    }
    return res.status(200).json(teams);
  } catch (error) {
    logger.error({ msg: `TEA01_ERR01: Error ${JSON.stringify(error)}` });
    return res.status(500).send();
  }
}

async function putTeam(req, res) {
  try {
    logger.info({ msg: 'TEA03_01: Received PUT request' });
    const { teamId } = req.params;
    const teamIdIsValid = objectIdIsValid(teamId);
    if (!teamIdIsValid) {
      return res.status(400).send();
    }
    const { clientId } = req;
    const teams = await db.getTeams(clientId);
    logger.info({ msg: `TEA03_02: teams: ${JSON.stringify(teams)}` });
    if (teams.length === 0) {
      return res.status(400).send();
    }
    // eslint-disable-next-line no-underscore-dangle
    const team = teams.find((t) => t._id.toString() === teamId);
    if (!team) {
      res.status(400).send();
    }
    const teamInReq = req.body;
    const newTeam = { team, ...teamInReq };
    const dbResponse = await db.updateTeamById(teamId, newTeam);
    const result = formatTeamResponse(dbResponse);
    return res.status(201).json(result);
  } catch (error) {
    logger.error({ msg: `An error occured while PUTting team. Error: ${JSON.stringify(error)}` });
    return res.status(500).send();
  }
}

async function deleteTeam(req, res) {
  try {
    const { teamId } = req.params;
    logger.info({ msg: `Received DELETE request for teamId ${teamId}` });
    await db.deleteTeamById(teamId);
    logger.info({ msg: `Successful deletion of teamId ${teamId}` });
    return res.status(204).send();
  } catch (error) {
    logger.error({ msg: `An error occured deleting team. Error: ${JSON.stringify(error)}` });
    return res.status(500).json({ message: `An error occured ${error}` });
  }
}

module.exports = {
  createTeam,
  getTeam,
  putTeam,
  deleteTeam,
};
