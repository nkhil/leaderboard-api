const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: false },
  name: { type: String, required: true },
});

module.exports = {
  LeaderboardModel: mongoose.model(
    'Leaderboard',
    leaderboardSchema,
    'leaderboards',
  ),
  leaderboardSchema,
}
