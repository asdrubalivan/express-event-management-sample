const winston = require('winston');
const moment = require('moment');

const { config } = winston;

const formatter = ({
  timestamp, level, message, meta,
}) => {
  const currentTimestamp = config.colorize(level, timestamp());
  const colorized = config.colorize(level, level.toUpperCase());
  const processedMessage = message || '';
  const processedMeta = (meta && Object.keys(meta).length ? `\n\t'${JSON.stringify(meta)}` : '');
  return `(${currentTimestamp} ${colorized}) ${processedMessage} ${processedMeta}`;
};

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: () => moment().format('MMMM Do YYYY, h:mm:ss.SSS a'),
      formatter,
      level: process.env.LOG_LEVEL || 'info',
    }),
  ],
});

module.exports = logger;
