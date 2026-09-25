const BOARD_SIZE = 52;
const SAFE_SPOTS = [0, 8, 13, 21, 26, 34, 39, 47];

function createInitialState(player1Id, player2Id) {
  return {
    players: {
      1: { id: player1Id, color: 'red', pieces: [-1, -1, -1, -1], finished: 0 },
      2: { id: player2Id, color: 'blue', pieces: [-1, -1, -1, -1], finished: 0 },
    },
    currentTurn: 1,
    dice: null,
    rollCount: 0,
    status: 'waiting',
    winner: null,
    moves: [],
    startedAt: Date.now(),
    finishedAt: null,
  };
}

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function isSafeSpot(pos) {
  if (pos === -1 || pos >= BOARD_SIZE) return true;
  return SAFE_SPOTS.includes(pos % 13);
}

function canMovePiece(state, playerIndex, pieceIndex, dice) {
  const piece = state.players[playerIndex].pieces[pieceIndex];
  if (piece === -1) return dice === 6;
  const newPos = piece + dice;
  return newPos <= BOARD_SIZE + 5;
}

function movePiece(state, playerIndex, pieceIndex, dice) {
  const player = state.players[playerIndex];
  let piece = player.pieces[pieceIndex];

  if (piece === -1 && dice === 6) {
    player.pieces[pieceIndex] = 0;
    return { success: true, newPos: 0, hit: null };
  }

  const newPos = piece + dice;
  if (newPos > BOARD_SIZE + 5) {
    return { success: false, error: 'حرکت مجاز نیست' };
  }

  let hit = null;
  if (newPos < BOARD_SIZE) {
    const absoluteNew = (newPos + (playerIndex - 1) * 13) % BOARD_SIZE;
    const opponentIndex = playerIndex === 1 ? 2 : 1;
    const opponent = state.players[opponentIndex];
    opponent.pieces.forEach((opPos, opIdx) => {
      if (opPos >= 0 && opPos < BOARD_SIZE) {
        const absoluteOp = (opPos + (opponentIndex - 1) * 13) % BOARD_SIZE;
        if (absoluteNew === absoluteOp && !isSafeSpot(opPos)) {
          opponent.pieces[opIdx] = -1;
          hit = { playerIndex: opponentIndex, pieceIndex: opIdx };
        }
      }
    });
  }

  player.pieces[pieceIndex] = newPos;
  if (newPos >= BOARD_SIZE) player.finished += 1;

  const allFinished = player.pieces.every(p => p >= BOARD_SIZE);
  if (allFinished) {
    state.winner = playerIndex;
    state.status = 'finished';
    state.finishedAt = Date.now();
  }

  return { success: true, newPos, hit };
}

function nextTurn(state, samePlayer = false) {
  if (!samePlayer) {
    state.currentTurn = state.currentTurn === 1 ? 2 : 1;
  }
  state.dice = null;
  state.rollCount = 0;
}

module.exports = {
  createInitialState, rollDice, canMovePiece, movePiece, nextTurn,
  isSafeSpot, BOARD_SIZE,
};
