const {
  rollDice,
  canMovePiece,
  movePiece,
  nextTurn
} = require('../game/logic');

const {
  findGameById,
  updateGame,
  addChatMessage,
  updateUser
} = require('../database');

const { verifyToken } = require('../utils/security');
const { checkRateLimit } = require('../utils/helpers');

const rooms = new Map();
const connections = new Map();

function getPlayerIndex(game, userId) {
  for (let i = 1; i <= 4; i++) {
    if (game.state?.players?.[i]?.id === userId) {
      return i;
    }
  }
  return null;
}

function setupWebSocket(server) {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        await handleMessage(ws, data);
      } catch (err) {
        ws.send(JSON.stringify({
          type: 'error',
          message: err.message
        }));
      }
    });

    ws.on('close', () => handleDisconnect(ws));
  });

  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  return wss;
}

async function handleMessage(ws, data) {
  switch (data.type) {
    case 'auth':
      await handleAuth(ws, data);
      break;

    case 'join_room':
      await handleJoinRoom(ws, data);
      break;

    case 'roll_dice':
      await handleRollDice(ws, data);
      break;

    case 'move_piece':
      await handleMovePiece(ws, data);
      break;

    case 'chat_message':
      await handleChatMessage(ws, data);
      break;

    case 'reaction':
      await handleReaction(ws, data);
      break;

    case 'voice_signal':
      await handleVoiceSignal(ws, data);
      break;

    case 'leave_game':
      await handleLeaveGame(ws, data);
      break;

    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'نوع پیام نامعتبر'
      }));
  }
}

async function handleAuth(ws, data) {
  try {
    const decoded = verifyToken(data.token);

    ws.userId = decoded.id;
    ws.username = decoded.username;

    connections.set(ws.userId, ws);

    ws.send(JSON.stringify({
      type: 'auth_success',
      user: {
        id: decoded.id,
        username: decoded.username
      }
    }));
  } catch (err) {
    ws.send(JSON.stringify({
      type: 'auth_error',
      message: err.message
    }));
  }
}

async function handleJoinRoom(ws, data) {
  const { roomCode } = data;

  const game = require('../database').findGameByRoomCode(roomCode);

  if (!game) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'اتاق یافت نشد'
    }));
  }

  ws.roomCode = roomCode;
  ws.gameId = game.id;

  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, new Set());
  }

  rooms.get(roomCode).add(ws);

  ws.send(JSON.stringify({
    type: 'joined_room',
    game
  }));

  const playerIndex = getPlayerIndex(game, ws.userId);

  broadcast(
    roomCode,
    {
      type: 'player_joined',
      userId: ws.userId,
      username: ws.username,
      playerIndex
    },
    ws
  );
}

async function handleRollDice(ws, data) {
  const game = findGameById(ws.gameId);

  if (!game) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'بازی یافت نشد'
    }));
  }

  const playerIndex = getPlayerIndex(game, ws.userId);

  if (!playerIndex) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'بازیکن بازی شناسایی نشد'
    }));
  }

  if (game.state.status !== 'playing') {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'بازی هنوز آماده نیست'
    }));
  }

  if (game.state.currentTurn !== playerIndex) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'نوبت شما نیست'
    }));
  }

  const dice = rollDice();

  game.state.dice = dice;
  game.state.rollCount += 1;

  updateGame(game.id, {
    state: game.state
  });

  broadcast(ws.roomCode, {
    type: 'dice_rolled',
    playerIndex,
    dice,
    gameState: game.state
  });
}

async function handleMovePiece(ws, data) {
  const { pieceIndex } = data;
  const game = findGameById(ws.gameId);

  if (!game) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'بازی یافت نشد'
    }));
  }

  const playerIndex = getPlayerIndex(game, ws.userId);

  if (!playerIndex) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'بازیکن بازی شناسایی نشد'
    }));
  }

  if (game.state.currentTurn !== playerIndex) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'نوبت شما نیست'
    }));
  }

  const dice = game.state.dice;

  if (!dice) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'ابتدا تاس بیندازید'
    }));
  }

  if (
    !canMovePiece(
      game.state,
      playerIndex,
      pieceIndex,
      dice
    )
  ) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'این حرکت مجاز نیست'
    }));
  }

  const result = movePiece(
    game.state,
    playerIndex,
    pieceIndex,
    dice
  );

  if (!result.success) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: result.error
    }));
  }

  const samePlayer = dice === 6;

  nextTurn(game.state, samePlayer);

  updateGame(game.id, {
    state: game.state
  });

  broadcast(ws.roomCode, {
    type: 'piece_moved',
    playerIndex,
    pieceIndex,
    newPos: result.newPos,
    hit: result.hit,
    gameState: game.state
  });

  if (game.state.status === 'finished') {
    broadcast(ws.roomCode, {
      type: 'game_finished',
      winner: game.state.winner,
      gameState: game.state
    });

    const winnerIndex = game.state.winner;
    const winnerId = game.state.players[winnerIndex]?.id;

    if (winnerId) {
      const wUser = updateUser(winnerId, {});

      updateUser(winnerId, {
        wins: (wUser?.wins || 0) + 1,
        gamesPlayed: (wUser?.gamesPlayed || 0) + 1
      });
    }

    for (let i = 1; i <= 4; i++) {
      if (i === winnerIndex) continue;

      const playerId = game.state.players[i]?.id;

      if (!playerId) continue;

      const pUser = updateUser(playerId, {});

      updateUser(playerId, {
        losses: (pUser?.losses || 0) + 1,
        gamesPlayed: (pUser?.gamesPlayed || 0) + 1
      });
    }
  }
}

async function handleChatMessage(ws, data) {
  const { message } = data;

  if (!message || !message.trim()) return;

  if (message.length > 500) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: 'پیام خیلی طولانی است'
    }));
  }

  const limit = checkRateLimit(
    `chat_${ws.userId}`,
    5,
    60000
  );

  if (!limit.allowed) {
    return ws.send(JSON.stringify({
      type: 'error',
      message: `لطفاً ${limit.retryAfter} ثانیه دیگر تلاش کنید`
    }));
  }

  const chatMsg = {
    id: Date.now().toString(),
    gameId: ws.gameId,
    senderId: ws.userId,
    senderName: ws.username,
    message: message.trim(),
    createdAt: new Date().toISOString()
  };

  addChatMessage(chat
cd ~/downloads && \
cp routes/game.js routes/game.js.backup4 && \
cp websocket/index.js websocket/index.js.backup4 && \
cat > routes/game.js <<'EOF'
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
