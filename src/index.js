require('dotenv').config();
const express = require('express');
const log = require('./utils/log');
const eventRoutes = require('./routes/events');
const { sequelize } = require('./db/db');

const main = async () => {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use((req, res, next) => {
    const { method, url, params } = req;
    log.debug(`Requested: ${method} ${url} with params`, params);
    next();
  });

  app.use('/events', eventRoutes);

  await sequelize.sync();

  app.listen(port, () => {
    log.info('Listening server on port', port);
  });
};

main().catch((err) => {
  log.error('There was an error executing the main function');
  log.error(err.stack);
});
