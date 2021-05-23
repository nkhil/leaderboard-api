const logger = require('@subgeniuscorp/logger');
const db = require('../lib/database/utils');
const { arrayHasProps } = require('../helpers/array-has-prop');

function formatScoresResponse(teams) {
  const formatSingleTeam = ({
    score, _id, teamName, leaderboardId,
  }) => ({
    id: _id.toString(),
    score,
    teamName,
    leaderboardId: leaderboardId.toString(),
  });
  return teams.map(formatSingleTeam);
}

function normaliseAddAndSubtract(scores) {
  // eslint-disable-next-line consistent-return
  const normaliseSingleScore = (score) => {
    if (typeof score.add !== 'number' && typeof score.subtract !== 'number') {
      return {
        ...score,
        add: 0,
        subtract: 0,
      };
    } if (typeof score.add === 'number') {
      return {
        ...score,
        subtract: 0,
      };
    } if (typeof score.subtract === 'number') {
      return {
        ...score,
        add: 0,
      };
    }
  };
  return scores.map(normaliseSingleScore);
}

async function postScores(req, res) {
  try {
    const { leaderboardId } = req.params;
    const { scores } = req.body;
    const normalisedScores = normaliseAddAndSubtract(scores);
    const teamIds = normalisedScores.map((team) => team.teamId);
    const teams = await db.getTeamsById(teamIds);
    if (!arrayHasProps(teams, 'leaderboardId', leaderboardId)) {
      return res.status(400).json({
        message: 'Team Ids provided do not belong to leaderboardId',
      });
    }
    const updatedTeams = teams.reduce((acc, team) => {
      // eslint-disable-next-line no-underscore-dangle
      const [{ add, subtract }] = normalisedScores.filter((t) => t.teamId === team._id.toString());
      const updatedScore = team.score + add - subtract;
      const updatedTeam = {
        ...team.toObject(),
        score: updatedScore,
      };
      acc.push(updatedTeam);
      return acc;
    }, []);
    await db.updateTeamScoresById(updatedTeams);
    const newlyUpdatedTeams = await db.getTeamsById(teamIds);
    const formattedResponse = formatScoresResponse(newlyUpdatedTeams);
    return res.status(201).json(formattedResponse);
  } catch (error) {
    logger.error({ msg: `Error posting scores. Error: ${JSON.stringify(error)}` });
    throw error;
  }
}

module.exports = {
  postScores,
  normaliseAddAndSubtract,
};
