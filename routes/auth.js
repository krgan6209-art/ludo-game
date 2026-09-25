const { hashPassword, verifyPassword, signToken } = require('../utils/security');
const { findUserByUsername, createUser } = require('../database');
const { generateId } = require('../utils/helpers');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (e) { resolve({}); }
    });
  });
}

module.exports = async function authRoutes(req, res) {
  const url = req.url;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (url === '/register' && req.method === 'POST') {
    const body = req.body || {};
    const { username, password, passwordConfirm } = body || {};
    if (!username || !password || !passwordConfirm) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'تمام فیلدها الزامی هستند' }));
    }
    if (password !== passwordConfirm) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'رمز عبور و تکرار آن یکسان نیستند' }));
    }
    if (username.length < 3 || username.length > 20) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'نام کاربری باید بین ۳ تا ۲۰ کاراکتر باشد' }));
    }
    if (password.length < 6) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }));
    }
    if (findUserByUsername(username)) {
      res.statusCode = 409;
      return res.end(JSON.stringify({ error: 'این نام کاربری قبلاً ثبت شده است' }));
    }
    const user = createUser({
      id: generateId(),
      username,
      passwordHash: hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      wins: 0, losses: 0, gamesPlayed: 0,
      createdAt: new Date().toISOString(),
    });
    const token = signToken({ id: user.id, username: user.username });
    return res.end(JSON.stringify({ token, user: { id: user.id, username: user.username, avatar: user.avatar } }));
  }

  if (url === '/login' && req.method === 'POST') {
    const body = req.body || {};
    const { username, password } = body || {};
    if (!username || !password) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'نام کاربری و رمز عبور الزامی هستند' }));
    }
    const user = findUserByUsername(username);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: 'نام کاربری یا رمز عبور اشتباه است' }));
    }
    const token = signToken({ id: user.id, username: user.username });
    return res.end(JSON.stringify({ token, user: { id: user.id, username: user.username, avatar: user.avatar } }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'مسیر یافت نشد' }));
};
