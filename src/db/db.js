const Sequelize = require('sequelize');

const instance = new Sequelize({
  database: process.env.DB_NAME || 'event_sample',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '12345',
  dialect: 'postgres',
});

const Event = require('./models/event')(instance, Sequelize);

module.exports = {
  sequelize: instance,
  Event,
};
