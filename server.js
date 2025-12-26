require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_app';

(async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGO_URI);
    console.log('MongoDB connected');

    // Create Express App
    const app = createApp();

    // Serve static files from React app in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Start Server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Frontend: http://localhost:5173`);
      console.log(`Backend API: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
})();

