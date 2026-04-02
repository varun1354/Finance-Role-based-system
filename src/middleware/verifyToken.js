const { verifyJwt } = require('../utils/jwt');
const { findUserById } = require('../models/userModel');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization format. Use Bearer token'
      });
    }

    const decoded = verifyJwt(token);
    const currentUser = await findUserById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (currentUser.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'User account is inactive'
      });
    }

    req.user = {
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      status: currentUser.status
    };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    return next(error);
  }
}

module.exports = verifyToken;
