const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const { signToken, authMiddleware } = require('../utils/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, tenant, role = 'member' } = req.body;
    if (!email || !password || !tenant) {
      return res.status(400).json({ error: 'email, password, tenant required' });
    }

    const exists = await User.findOne({ email, tenant });
    if (exists) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const u = new User({ email, passwordHash: hash, role, tenant });
    await u.save();

    const token = signToken(u);
    const tenantDoc = await Tenant.findOne({ slug: tenant });

    return res.status(201).json({
      token,
      user: { email: u.email, role: u.role, tenant: u.tenant },
      tenant: { slug: tenantDoc.slug, plan: tenantDoc.plan }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, tenant } = req.body;
    if (!email || !password || !tenant) {
      return res.status(400).json({ error: 'email, password, tenant required' });
    }

    const user = await User.findOne({ email, tenant });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    const tenantDoc = await Tenant.findOne({ slug: tenant });

    return res.json({
      token,
      user: { email: user.email, role: user.role, tenant: user.tenant },
      tenant: { slug: tenantDoc.slug, plan: tenantDoc.plan }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tenantDoc = await Tenant.findOne({ slug: user.tenant });
    res.json({
      user: { email: user.email, role: user.role, tenant: user.tenant },
      tenant: { slug: tenantDoc.slug, plan: tenantDoc.plan }
    });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
