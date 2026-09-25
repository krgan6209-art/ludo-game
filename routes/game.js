const { createGame, findGameByRoomCode, updateGame, findGameById } = require('../database');
const { generateRoomCode, generateId } = require('../utils/helpers');
const { createInitialState } = require('../game/logic');

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}

module.exports = async function gameRoutes(req, res) {
  const url = req.url;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (url === '/create' && req.method === 'POST') {
    const roomCode = generateRoomCode();

    const game = createGame({
      id: generateId(),
      roomCode,
      player1: req.user.id,
      player2: null,
      player3: null,
      player4: null,
      state: createInitialState(
        req.user.id,
        null,
        null,
        null
      ),
      currentTurn: 1,
      status: 'waiting',
      winner: null,
      createdAt: new Date().toISOString(),
      finishedAt: null
    });

    return res.end(JSON.stringify({ game }));
  }

  if (url === '/join' && req.method === 'POST') {
    console.log('JOIN REQUEST RECEIVED:', req.method, url);

    const body = req.body || await parseBody(req);
    const { roomCode } = body || {};

    if (!roomCode) {
      res.statusCode = 400;
      return res.end(JSON.stringify({
        error: 'کد اتاق الزامی است'
      }));
    }

    const code = roomCode.toUpperCase();
    const game = findGameByRoomCode(code);

    console.log(
      'JOIN RESULT:',
      code,
      game ? 'FOUND' : 'NOT_FOUND'
    );

    if (!game) {
      res.statusCode = 404;
      return res.end(JSON.stringify({
        error: 'اتاق یافت نشد'
      }));
    }

    const playerIds = [
      game.player1,
      game.player2,
      game.player3,
      game.player4
    ];

    if (playerIds.includes(req.user.id)) {
      return res.end(JSON.stringify({ game }));
    }

    let slot = null;

    if (!game.player1) slot = 1;
    else if (!game.player2) slot = 2;
    else if (!game.player3) slot = 3;
    else if (!game.player4) slot = 4;

    if (!slot) {
      res.statusCode = 403;
      return res.end(JSON.stringify({
        error: 'این اتاق پر است'
      }));
    }

    game[`player${slot}`] = req.user.id;

    if (!game.state.players) {
      game.state = createInitialState(
        game.player1,
        game.player2,
        game.player3,
        game.player4
      );
    } else {
      game.state.players[slot].id = req.user.id;
    }

    const allPlayersJoined =
      !!game.player1 &&
      !!game.player2 &&
      !!game.player3 &&
      !!game.player4;

    game.status = allPlayersJoined ? 'playing' : 'waiting';

    updateGame(game.id, {
      player2: game.player2,
      player3: game.player3,
      player4: game.player4,
      state: game.state,
      status: game.status
    });

    return res.end(JSON.stringify({ game }));
  }

  if (url.startsWith('/') && req.method === 'GET') {
    const id = url.split('/')[3];
    const game = findGameById(id);

    if (!game) {
      res.statusCode = 404;
      return res.end(JSON.stringify({
        error: 'بازی یافت نشد'
      }));
    }

    return res.end(JSON.stringify({ game }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({
    error: 'مسیر یافت نشد'
  }));
};
