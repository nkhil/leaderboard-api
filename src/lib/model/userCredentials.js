const mongoose = require('mongoose');

const UserCredentialSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  userId: { type: String, required: true, unique: true },
  clientSecretHash: { type: String, required: true },
});

module.exports = {
  UserCredentialModel: mongoose.model(
    'UserCredentials',
    UserCredentialSchema,
  ),
  UserCredentialSchema,
};
