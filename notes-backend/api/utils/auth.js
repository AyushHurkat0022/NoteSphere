const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const JWT_EXP = '7d';

function signToken(user) {
  return jwt.sign({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    tenant: user.tenant
  }, JWT_SECRET, { expiresIn: JWT_EXP });
}

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      tenant: payload.tenant
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { signToken, authMiddleware, requireRole };
