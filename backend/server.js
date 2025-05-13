
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

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: false
  },
  transports: ['polling', 'websocket'] 
});


app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));
app.use(express.json());


app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/api/todos', todoRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    serverTime: new Date().toISOString(),
    socketConnections: io.engine.clientsCount
  });
});


mongoose.connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    socketHandler(io); 
  })
  .catch(err => console.error('DB connection error:', err));