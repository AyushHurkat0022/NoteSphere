require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantRoutes = require('./routes/tenants');

const app = express();

const allowedOrigins = [
  "https://note-sphere-woad.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ error: err.message || 'internal error' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
}

start();
