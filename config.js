module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'ludo-super-secret-key-change-in-production',
  DB_PATH: process.env.DB_PATH || './database/data.json',
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX: 100,
  CHAT_RATE_LIMIT: 5,
  TOKEN_EXPIRY_HOURS: 24,
};
