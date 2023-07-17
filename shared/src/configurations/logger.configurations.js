const bunyan = require('bunyan');
const formatOut = require('bunyan-format')({ color: true });

const logger = bunyan.createLogger({
    name: 'my-app',
    level: 'info',
    streams: [
      {
        level: 'info',
        stream: formatOut,
      },
    ],
  });

module.exports = logger;