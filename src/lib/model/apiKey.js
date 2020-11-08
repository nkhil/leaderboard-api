const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apiKeySchema = new mongoose.Schema({
  apiKeyHash: { type: String, required: true, unique: true },
  salt: { type: String, required: true, unique: true },
  teamId: { type: Schema.Types.ObjectId, ref: 'team', required: true, unique: true },
});

module.exports = {
  ApiKeyModel: mongoose.model(
    'apikey',
    apiKeySchema,
    'apikeys',
  ),
  apiKeySchema,
}
