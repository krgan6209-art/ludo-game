const { updateUser } = require('../database');

module.exports = async function userRoutes(req, res) {
  const url = req.url;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (url === '/api/user/me' && req.method === 'GET') {
    const u = req.user;
    return res.end(JSON.stringify({
      id: u.id, username: u.username, avatar: u.avatar,
      wins: u.wins, losses: u.losses, gamesPlayed: u.gamesPlayed,
      createdAt: u.createdAt,
    }));
  }

  if (url === '/api/user/stats' && req.method === 'GET') {
    const u = req.user;
    return res.end(JSON.stringify({
      wins: u.wins, losses: u.losses, gamesPlayed: u.gamesPlayed,
      winRate: u.gamesPlayed > 0 ? Math.round((u.wins / u.gamesPlayed) * 100) : 0,
    }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'مسیر یافت نشد' }));
};
