const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const startupsRouter = require('./routes/startups');
const investorsRouter = require('./routes/investors');
// const internsRouter = require('./routes/interns'); // Removed
const watchlistRouter = require('./routes/watchlist');
const messagesRouter = require('./routes/messages');
const investmentsRouter = require('./routes/investments');
const uploadRouter = require('./routes/upload');
const path = require('path');

const { notFound, errorHandler } = require('./middleware/errorHandlers');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/startups', startupsRouter);
  app.use('/api/investors', investorsRouter);
  // app.use('/api/interns', internsRouter); // Removed
  app.use('/api/watchlist', watchlistRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/investments', investmentsRouter);
  app.use('/api/upload', uploadRouter);

  // Serve uploads folder
  app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

  app.get('/', (req, res) => res.send(''));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
