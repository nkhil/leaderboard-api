const logger = require('@subgeniuscorp/logger');
const db = require('../lib/database/utils');

function formatLeaderboardResponse({ _id, name }) {
  return {
    id: _id,
    name,
  };
}

async function createLeaderboard(req, res) {
  try {
    const { clientId } = req;
    const leaderboardBody = req.body;
    logger.info({ msg: `Received leaderboard create request for clientId ${clientId}` });
    const postBody = { clientId, ...leaderboardBody };
    const response = await db.createLeaderboard(postBody);
    logger.info({ msg: `Successfully created leaderboard for clientId ${clientId}` });
    const formattedResponse = formatLeaderboardResponse(response);
    res.status(200).json(formattedResponse);
  } catch (error) {
    if (error && error.code === 11000) {
      logger.error({ msg: `Duplicate leaderboard error ${JSON.stringify(error)}` });
      res.status(409).send();
    }
    logger.error({ msg: `An error occured. Error: ${JSON.stringify(error)}` });
    res.status(500).send();
  }
}

module.exports = {
  createLeaderboard,
};
