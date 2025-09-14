// api/routes/notes.js
const express = require('express');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();
router.use(authMiddleware);

// helper: check if tenant is pro
async function tenantPlanIsPro(tenantSlug) {
  const t = await Tenant.findOne({ slug: tenantSlug });
  return t && t.plan === 'pro';
}

// POST /notes - create
router.post('/', authMiddleware, async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.user.tenant });

  // Enforce free plan limit (3 notes)
  if (tenant.plan === 'free') {
    const noteCount = await Note.countDocuments({ tenant: req.user.tenant });
    if (noteCount >= 3) {
      return res.status(403).json({ error: "Free plan limit reached. Upgrade to Pro." });
    }
  }

  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    tenant: req.user.tenant,
    owner: req.user.id
  });
  await note.save();
  res.status(201).json(note);
});

// GET /notes - list tenant notes
router.get('/', async (req, res) => {
  try {
    const tenant = req.user.tenant;
    const notes = await Note.find({ tenant })
    .populate('owner', 'email role') 
    .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('List notes error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /notes/:id - get specific note (tenant enforced)
router.get('/:id', async (req, res) => {
  try {
    const tenant = req.user.tenant;
    const note = await Note.findOne({ _id: req.params.id, tenant });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    console.error('Get note error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /notes/:id - update
router.put('/:id', async (req, res) => {
  try {
    const tenant = req.user.tenant;
    const update = { ...req.body, updatedAt: Date.now() };
    const note = await Note.findOneAndUpdate({ _id: req.params.id, tenant }, update, { new: true });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    console.error('Update note error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /notes/:id - delete
router.delete('/:id', async (req, res) => {
  try {
    const tenant = req.user.tenant;
    const note = await Note.findOneAndDelete({ _id: req.params.id, tenant });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete note error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
