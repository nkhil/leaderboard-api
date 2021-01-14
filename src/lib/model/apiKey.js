const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apiKeySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true, unique: true },
  clientSecretHash: { type: String, required: true },
  apiKey: { type: String, required: true },
});

module.exports = {
  ApiKeyModel: mongoose.model(
    'ApiKey',
    apiKeySchema,
    'apikeys',
  ),
  apiKeySchema,
}
