const createResponse = (statusCode, body, headers = {}) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      ...headers
    },
    body: JSON.stringify(body)
  };
};

const success = (data) => createResponse(200, data);
const created = (data) => createResponse(201, data);
const badRequest = (message) => createResponse(400, { error: message });
const unauthorized = (message) => createResponse(401, { error: message });
const forbidden = (message) => createResponse(403, { error: message });
const notFound = (message) => createResponse(404, { error: message });
const internalError = (message) => createResponse(500, { error: message });

module.exports = {
  createResponse,
  success,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  internalError
};