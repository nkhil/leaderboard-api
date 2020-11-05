const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({
  teamName: { type: String, required: true, index: { unique: true } },
});

module.exports = {
  TeamModel: mongoose.model(
    'team',
    teamsSchema,
    'teams',
  ),
  teamsSchema,
}
