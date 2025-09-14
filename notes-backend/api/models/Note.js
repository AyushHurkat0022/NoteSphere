const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  tenant: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);
