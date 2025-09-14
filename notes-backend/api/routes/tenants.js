const express = require('express');
const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, slug, plan } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
    const t = new Tenant({ name, slug, plan });
    await t.save();
    res.status(201).json({ tenant: { slug: t.slug, plan: t.plan, name: t.name } });
  } catch (err) {
    console.error('Create tenant error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    if (req.user.tenant !== slug) return res.status(403).json({ error: 'Tenant mismatch' });

    res.json({ tenant: { slug: tenant.slug, plan: tenant.plan, name: tenant.name } });
  } catch (err) {
    console.error('Get tenant error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:slug/upgrade', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    if (req.user.tenant !== slug) return res.status(403).json({ error: 'Tenant mismatch' });
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin required' });

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

    tenant.plan = 'pro';
    await tenant.save();

    // return updated tenant + current user
    res.json({
      message: 'Upgraded to Pro',
      tenant: { slug: tenant.slug, plan: tenant.plan, name: tenant.name },
      user: { id: req.user.id, email: req.user.email, role: req.user.role, tenant: req.user.tenant }
    });
  } catch (err) {
    console.error('Upgrade error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:slug/invite', authMiddleware, async (req, res) => {
  try {
    const { slug } = req.params;
    if (req.user.tenant !== slug) return res.status(403).json({ error: 'Tenant mismatch' });
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin required' });

    const { email, role = 'member', password = 'password' } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const exists = await User.findOne({ email, tenant: slug });
    if (exists) return res.status(400).json({ error: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
    const u = new User({ email, passwordHash: hash, role, tenant: slug });
    await u.save();

    const tenant = await Tenant.findOne({ slug });

    res.status(201).json({
      message: 'User invited',
      newUser: { email: u.email, role: u.role, tenant: u.tenant },
      tenant: { slug: tenant.slug, plan: tenant.plan, name: tenant.name }
    });
  } catch (err) {
    console.error('Invite error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
