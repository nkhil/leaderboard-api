
module.exports = {
  SALT_LENGTH: process.env.SALT_LENGTH || 10,
  API_KEY_LENGTH: 32, // This is also validated by Swagger
  S3_BUCKET: process.env.S3_BUCKET || 'test',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'accesskey',
  AWS_SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || 'secret'
}
