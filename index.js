const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // ✅ Add HTTP for socket
const { Server } = require('socket.io'); // ✅ Socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Stage Scout Server is Running");
});

// Routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const messageRoutes = require('./routes/messageRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const commentLikeRoutes = require('./routes/commentLikeRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const castingRoutes = require('./routes/castingRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/comments', commentLikeRoutes); // ✅ Fixed
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/casting', castingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);


// Socket.io logic
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join room (e.g., group chat)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`👥 User joined room: ${roomId}`);
  });

  // Send message
  socket.on('sendMessage', ({ roomId, message }) => {
    socket.to(roomId).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Debugging .env
console.log("✅ Loaded .env → MONGO_URI =", process.env.MONGO_URI);
