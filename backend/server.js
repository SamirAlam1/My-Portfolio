const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ─── CORS — allow all origins in development ──────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // and any localhost/192.168.x.x origin in development
    if (!origin) return callback(null, true);
    if (
      process.env.NODE_ENV === 'development' ||
      origin === process.env.FRONTEND_URL ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://192.168.') ||
      origin.startsWith('http://10.') ||
      origin.startsWith('http://172.')
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/skills',    require('./routes/skills'));
app.use('/api/education', require('./routes/education'));
app.use('/api/blogs',     require('./routes/blogs'));
app.use('/api/messages',  require('./routes/messages'));
app.use('/api/gallery',   require('./routes/gallery'));
app.use('/api/seed',      require('./routes/seed'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Portfolio CMS API is running 🚀' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use(errorHandler);

// ─── Start Server — listen on all interfaces (0.0.0.0) ───────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📱 Network access: http://YOUR_IP:${PORT}/api/health`);
});