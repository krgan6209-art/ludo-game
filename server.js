const http = require('http');
const express = require('express');
const path = require('path');
const { PORT } = require('./config');
const { authMiddleware } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const { setupWebSocket } = require('./websocket');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', async (req, res, next) => {
  try { await authRoutes(req, res); } catch (e) { next(e); }
});

app.use('/api/user', (req, res, next) => authMiddleware(req, res, () => userRoutes(req, res).catch(next)));
app.use('/api/game', (req, res, next) => authMiddleware(req, res, () => gameRoutes(req, res).catch(next)));

// Health check for Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const server = http.createServer(app);
setupWebSocket(server);

const port = PORT || 3000;
server.listen(port, () => {
  console.log(`سرور منچ آنلاین روی پورت ${port} اجرا شد`);
  console.log(`http://localhost:${port}`);
});
