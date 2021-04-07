const jwt = require('jsonwebtoken');
const { extractToken } = require('../middleware/verifyToken');
const { ROUTES_TO_IGNORE } = require('../config');

function getRoute(req) {
  const route = req.route ? req.route.path : ''; // check if the handler exist
  const baseUrl = req.baseUrl ? req.baseUrl : ''; // adding the base url if the handler is a child of another handler
  return route ? `${baseUrl === '/' ? '' : baseUrl}${route}` : 'unknown route';
}

function routeShouldBeMeasured(route) {
  if (ROUTES_TO_IGNORE.includes(route)) {
    return false;
  }
  return true;
}

function statusCodeShouldBeMeasured(statusCode) {
  return statusCode >= 200 && statusCode < 300;
}

function getClientIdFromHeaders(request) {
  const bearerToken = extractToken(request);
  const token = jwt.verify(bearerToken, 'secret');
  return token.clientId;
}

function getClientIdFromRequest(request) {
  return request.headers['x-client-id']
    || getClientIdFromHeaders(request);
}

async function countRequests({ request, statusCode }) {
  const route = getRoute(request);
  if (routeShouldBeMeasured(route)
    && statusCodeShouldBeMeasured(statusCode)) {
    const clientId = getClientIdFromRequest(request);
    console.log(`ClientId: ${clientId}`);
    console.log(`MEASURE THIS ROUTE! ${route} ${statusCode}`);
  }
}

module.exports = {
  countRequests,
};
