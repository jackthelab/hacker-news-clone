const jwt = require('jsonwebtoken');
const appSecret = process.env.APP_SECRET

const getTokenPayload = (token) => {
  return jwt.verify(token, appSecret);
}

const getUserId = (req, authToken) => {
  if(req) {
    const authHeader = req.headers.authorization;
    if(authHeader) {
      const token = authHeader.replace('Bearer ', '');
      if(!token) {
        throw new Error('No Token found');
      }
      const { userId } = getTokenPayload(token);
      return userId;
    } else if(authToken) {
      const { userId } = getTokenPayload(authToken);
      return userId;
    }
  }

  throw new Error('Not authenticated');
}

module.exports = {
  appSecret,
  getUserId
}