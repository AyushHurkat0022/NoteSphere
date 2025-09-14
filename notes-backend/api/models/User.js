const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','member'], default: 'member' },
  tenant: { type: String, required: true }, // tenant slug (string)
  createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ email: 1, tenant: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);
