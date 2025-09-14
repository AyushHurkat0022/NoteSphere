const mongoose = require('mongoose');

const TenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // 'acme' or 'globex'
  plan: { type: String, enum: ['free','pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);
