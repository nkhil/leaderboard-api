
module.exports = {
  SALT_LENGTH: process.env.SALT_LENGTH || 10,
  API_KEY_LENGTH: 32, // This is also validated by Swagger
}
