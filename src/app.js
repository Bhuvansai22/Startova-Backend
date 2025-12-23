const express = require('express');
const cors = require('cors');

const authRouter = require('./routes/auth');
const startupsRouter = require('./routes/startups');
const investorsRouter = require('./routes/investors');
const internsRouter = require('./routes/interns');

const { notFound, errorHandler } = require('./middleware/errorHandlers');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', authRouter);
  app.use('/api/startups', startupsRouter);
  app.use('/api/investors', investorsRouter);
  app.use('/api/interns', internsRouter);

  app.get('/', (req, res) => res.send(''));

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
