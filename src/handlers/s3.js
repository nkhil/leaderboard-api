const logger = require('@subgeniuscorp/logger');
const AWS = require('aws-sdk');
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET } = require('../constants');

async function getS3SignedUrl(req, res) {
  try {
    logger.info({ msg: `Received request to get S3 signed URL: ${JSON.stringify(req.query)}` });
    const fileName = req.query.filename;
    const fileType = req.query.filetype;
    const credentials = {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    };
    const s3 = new AWS.S3({
      credentials,
      s3ForcePathStyle: true,
      endpoint: 'http://localhost:4566', // points to localstack
    });
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    };
    logger.info({ msg: 'Sending S3.getSignedURL putObject request' });
    const s3Response = await s3.getSignedUrl('putObject', s3Params);
    logger.info({ msg: 'Successful response from AWS API' });
    const response = {
      signedRequest: s3Response,
      url: s3Response,
    };
    logger.info({ msg: 'Sending the response to caller' });
    res.status(200).json(response);
  } catch (error) {
    logger.error({ msg: `Error while getting S3 signed URL. ${JSON.stringify(error)}` });
    res.status(500).send();
    throw error;
  }
}

module.exports = {
  getS3SignedUrl,
};
