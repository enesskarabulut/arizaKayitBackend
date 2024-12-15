const jwt = require('jsonwebtoken');

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
}

module.exports = { verifyJWT };
