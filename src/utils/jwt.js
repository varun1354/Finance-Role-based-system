const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error('JWT_SECRET is not configured');
    error.statusCode = 500;
    throw error;
  }

  return secret;
}

function generateToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1d' });
}

function verifyJwt(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  generateToken,
  verifyJwt
};
