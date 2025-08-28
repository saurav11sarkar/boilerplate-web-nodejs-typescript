import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import app from './app';
import { error } from 'console';
import config from './app/config';

const PORT = config.port || 5000;

const main = async () => {
  try {
    // Ensure mongoUri is defined
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    const mongo = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${mongo.connection.host}`);

    // Create HTTP server from express app
    const server = http.createServer(app);

    // Integrate Socket.io
    const io = new Server(server, {
      cors: {
        origin: '*', // e.g. http://localhost:3000
        methods: ['GET', 'POST'],
      },
    });

    // Listen for connections
    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);

      // Example: receive message from client
      socket.on('chat message', (msg) => {
        console.log('📩 Message received:', msg);

        // send to all clients
        io.emit('chat message', msg);
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Error starting server:', error.message || error);
    process.exit(1);
  }
};

main();
