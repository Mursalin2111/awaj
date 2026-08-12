require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/auth');
const concernsRoutes = require('./routes/concerns');
const proposalsRoutes = require('./routes/proposals');
const projectsRoutes = require('./routes/projects');
const researchRoutes = require('./routes/research');
const collaborationRoutes = require('./routes/collaboration');
const leaderboardRoutes = require('./routes/leaderboard');
const dashboardRoutes = require('./routes/dashboard');
const opendataRoutes = require('./routes/opendata');
const chatbotRoutes = require('./routes/chatbot');
const feedbackRoutes = require('./routes/feedback');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/concerns', concernsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/open-data', opendataRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Awaj API server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  });
}

start();
