// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PORT, MONGO_URI } = require('./config.js');
const todoRoutes = require('./routes/todoRoutes.js');
const socketHandler = require('./socket/socketHandlers.js');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with more permissive CORS settings
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins - for development only
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  },
  transports: ['polling', 'websocket'] // Try polling first
});

// Middleware
app.use(cors({
  origin: "*", // Allow all origins - for development only
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));
app.use(express.json());

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/todos', todoRoutes);

// Add this troubleshooting endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    serverTime: new Date().toISOString(),
    socketConnections: io.engine.clientsCount
  });
});

// Start server
mongoose.connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    socketHandler(io); // Pass io to socket handler
  })
  .catch(err => console.error('DB connection error:', err));