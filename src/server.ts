/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

const PORT = config.port || 5000;

const main = async () => {
  try {
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not defined in environment variables.');
    }

    const mongo = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${mongo.connection.host}`);

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: '*', // For dev; change in prod
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('🔌 New client connected:', socket.id);

      // Chat event
      socket.on(
        'chat message',
        (msg: { userName: string; message: string }) => {
          console.log('📩 Message received:', msg);

          // Broadcast to ALL clients (including sender)
          io.emit('chat message', msg);
        },
      );

      socket.on('disconnect', () => {
        console.log('❌ Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error: any) {
    console.error('❌ Error starting server:', error.message || error);
    process.exit(1);
  }
};

main();