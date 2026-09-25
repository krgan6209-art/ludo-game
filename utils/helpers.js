function generateRoomCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

const rateLimitStore = new Map();

function checkRateLimit(key, max, windowMs) {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  if (!record) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true };
  }
  if (record.count >= max) {
    return { allowed: false, retryAfter: Math.ceil((record.resetTime - now) / 1000) };
  }
  record.count++;
  return { allowed: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore) {
    if (now > record.resetTime) rateLimitStore.delete(key);
  }
}, 60000);

module.exports = { generateRoomCode, generateId, checkRateLimit };
