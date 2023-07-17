const responseTime = require('response-time');

module.exports.responseTimeMiddleware = responseTime({
    header: 'X-Response-Time',
  },(req , res ,next ) => {
    // Do something with the response time.
    next();
  })