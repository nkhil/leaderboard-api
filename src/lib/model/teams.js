const mongoose = require('mongoose');

const teamsSchema = new mongoose.Schema({
  teamName: { type: String, required: true, index: { unique: true } },
});

module.exports = mongoose.model(
  'team',
  teamsSchema,
  'teams',
)
