'use strict';

const { name } = require('../package.json');

module.exports = {
  name,
  port: 8080,
  mongo: {
    maxLimit: 100,
    connectionString: process.env.MONGO_CONNECTION_STRING,
  },
};
