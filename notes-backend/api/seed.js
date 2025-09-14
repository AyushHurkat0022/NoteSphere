require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Clearing old data...');
  await Tenant.deleteMany({});
  await User.deleteMany({});

  const tenants = [
    { name: 'Acme Corporation', slug: 'acme', plan: 'free' },
    { name: 'Globex Corporation', slug: 'globex', plan: 'free' }
  ];
  console.log('Creating tenants...');
  await Tenant.insertMany(tenants);

  const passwordHash = await bcrypt.hash('password', 10);

  const users = [
    { email: 'admin@acme.test', passwordHash, role: 'admin', tenant: 'acme' },
    { email: 'user@acme.test', passwordHash, role: 'member', tenant: 'acme' },
    { email: 'admin@globex.test', passwordHash, role: 'admin', tenant: 'globex' },
    { email: 'user@globex.test', passwordHash, role: 'member', tenant: 'globex' }
  ];

  console.log('Creating users...');
  await User.insertMany(users);
  console.log('Seed complete. Created tenants & test users (password: "password")');
  process.exit(0);
}

run().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
