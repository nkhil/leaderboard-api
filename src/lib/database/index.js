const mongoose = require('mongoose');
const {
  mongo: { connectionString },
} = require('../../config');

async function connect() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on('connected', () =>
      console.log('Connected to database')
    );
    mongoose.connection.on('disconnected', () =>
      console.log('Disconnected from database')
    );
  } catch (err) {
    console.log('Error connecting to database');
    console.log('Error:', err);
  }
}

module.exports = {
  connect,
};
