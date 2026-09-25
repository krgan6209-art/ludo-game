const { verifyToken } = require('../utils/security');
const { findUserById } = require('../database');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'توکن احراز هویت یافت نشد' }));
    }
    const decoded = verifyToken(token);
    const user = findUserById(decoded.id);
    if (!user) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'کاربر یافت نشد' }));
    }
    req.user = user;
    next();
  } catch (err) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: err.message }));
  }
}

module.exports = { authMiddleware };
