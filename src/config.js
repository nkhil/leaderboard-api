const { name } = require('../package.json');
require('dotenv').config();

module.exports = {
  name,
  port: process.env.PORT || 8080,
  mongo: {
    maxLimit: 100,
    connectionString: process.env.MONGO_CONNECTION_STRING,
  },
  tokenSecret: process.env.TOKEN_SECRET,
};
