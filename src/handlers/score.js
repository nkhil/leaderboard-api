const db = require('../lib/database/utils')
const logger = require('pino')()

function formatScoresResponse(teams) {
	const formatSingleTeam = ({ score, _id, teamName, leaderboardId }) => {
		return {
			id: _id.toString(),
			score,
			teamName,
			leaderboardId: leaderboardId.toString(),
		}
	}
	return teams.map(formatSingleTeam);
}

function normaliseAddAndSubtract(scores) {
	const normaliseSingleScore = score => {
		if (typeof score.add !== 'number' && typeof score.subtract !== 'number') {
			score.add = 0;
			score.subtract = 0;
		} else if (typeof score.add === 'number') {
			score.subtract = 0;
		} else if (typeof score.subtract === 'number') {
			score.add = 0;
		}
	} 
	return scores.map(normaliseSingleScore);
}

async function postScores(req, res) {
	try {
		const { leaderboardId } = req.params; // TODO: make sure the request isn't asking for data from teams that don't belong to this leaderboard
		const { scores } = req.body;
		normaliseAddAndSubtract(scores);
		const teamIds = scores.map(team => team.teamId)
		const teams = await db.getTeamsById(teamIds);
		const updatedTeams = teams.reduce((acc, team) => {
			const [{ add, subtract }] = scores.filter(t => t.teamId === team._id.toString());
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
		res.status(201).json(formattedResponse);
	} catch (error) {
		logger.error({ msg: `Error posting scores. Error: ${JSON.stringify(error)}` });
	}
}

module.exports = {
	postScores,
	normaliseAddAndSubtract,
}