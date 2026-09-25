const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('../config');

const dbFile = path.resolve(DB_PATH);
let data = { users: [], games: [], chatMessages: [], reactions: [] };
let dirty = false;

function load() {
  try {
    if (fs.existsSync(dbFile)) {
      data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    } else {
      save();
    }
  } catch (e) {
    console.error('خطا در بارگذاری دیتابیس:', e.message);
    save();
  }
}

function save() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    dirty = false;
  } catch (e) {
    console.error('خطا در ذخیره دیتابیس:', e.message);
  }
}

setInterval(() => { if (dirty) save(); }, 5000);

function findUserByUsername(username) {
  return data.users.find(u => u.username === username);
}

function findUserById(id) {
  return data.users.find(u => u.id === id);
}

function createUser(user) {
  data.users.push(user);
  dirty = true; save(); return user;
}

function updateUser(id, updates) {
  const idx = data.users.findIndex(u => u.id === id);
  if (idx === -1) return null;
  data.users[idx] = { ...data.users[idx], ...updates };
  dirty = true; save(); return data.users[idx];
}

function createGame(game) {
  data.games.push(game);
  dirty = true; save(); return game;
}

function findGameByRoomCode(roomCode) {
  return data.games.find(g => g.roomCode === roomCode);
}

function findGameById(id) {
  return data.games.find(g => g.id === id);
}

function updateGame(id, updates) {
  const idx = data.games.findIndex(g => g.id === id);
  if (idx === -1) return null;
  data.games[idx] = { ...data.games[idx], ...updates };
  dirty = true; save(); return data.games[idx];
}

function addChatMessage(msg) {
  data.chatMessages.push(msg);
  dirty = true;
  if (data.chatMessages.length > 2000) data.chatMessages.shift();
  save(); return msg;
}

function getChatMessagesByGameId(gameId, limit = 100) {
  return data.chatMessages.filter(m => m.gameId === gameId).slice(-limit);
}

load();

module.exports = {
  load, save,
  findUserByUsername, findUserById, createUser, updateUser,
  createGame, findGameByRoomCode, findGameById, updateGame,
  addChatMessage, getChatMessagesByGameId,
};
