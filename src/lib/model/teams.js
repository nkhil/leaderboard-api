const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({
  teamName: { type: String, required: true, index: { unique: true } },
  clientId: { type: String, required: true },
	leaderboardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard'},
});

module.exports = {
  TeamModel: mongoose.model(
    'team',
    teamsSchema,
    'teams',
  ),
  teamsSchema,
}
