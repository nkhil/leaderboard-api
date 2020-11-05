const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, index: { unique: false } },
  lastName: { type: String, required: false, index: { unique: false } },
  email: { type: String, required: true, index: { unique: true } },
  teams: [{ type: Schema.Types.ObjectId, ref: 'team', required: false }],
  emailVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

module.exports = {
  UserModel: mongoose.model(
    'user',
    userSchema,
    'users',
  ),
  userSchema,
}

