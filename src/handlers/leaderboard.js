const db = require('../lib/database/utils');
const logger = require('pino')();

async function createLeaderboard(req, res) {
	try {
		const { clientId } = req;
		const leaderboardBody = req.body;
		logger.info({ msg: `Received leaderboard create request for clientId ${clientId}`});
		const response = await db.createLeaderboard(leaderboardBody);
		logger.info({ msg: `Successfully created leaderboard for clientId ${clientId}`});
		res.status(200).json(response);
	} catch (error) {
		if (error & error.code === 11000) {
			logger.error({ msg: `Duplicate leaderboard error ${JSON.stringify(error)}`});
			res.status(409).send();
		}
		logger.error({ msg: `An error occured. Error: ${JSON.stringify(error)}`});
		res.status(500).send();
	}
}

module.exports = {
	createLeaderboard,
}
