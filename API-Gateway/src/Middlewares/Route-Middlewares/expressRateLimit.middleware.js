const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redisClient = require('../../../../shared/src/configurations/redis.configurations');

function expressRateLimiterMiddleware({
  endpoint,
  windowDurationInMinutes,
  requestLimit,
  statusCode,
  ErrorMessage,
}) {
  return rateLimit({
    windowMs: windowDurationInMinutes * 60 * 1000, // Convert minutes to milliseconds
    max: requestLimit, // Limit each IP to <requestLimit> requests per `window` (here, per 30 seconds)
    message: ErrorMessage,
    statusCode: statusCode,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: true, // Disable the `X-RateLimit-*` header

    // Redis store configuration to store the client ip along with the number of hits made by it in the given time window specified above
    // example keyname is like =>  keyname::<ip> and value would be the number of hits made in the given time window  6
    store: new RedisStore({
      sendCommand: (...args) => {
        return redisClient.sendCommand(args);
      },
      prefix: `EndPoint::/${endpoint}_IP`,
    }),
  });
}

module.exports.registerUserMiddlewares = {
  expressRateLimiterMiddleware: expressRateLimiterMiddleware({
    endpoint: 'register-user',
    windowDurationInMinutes: 0.5, // 30 seconds
    requestLimit: 2, // Limit each IP to 2 requests per 30 seconds
    statusCode: 429, // HTTP status code for rate limit exceeded
    ErrorMessage: 'Too many requests from your IP. Please try again later.',
  }),
};
 
module.exports.loginUserMiddlewares = {
  expressRateLimiterMiddleware: expressRateLimiterMiddleware({
    endpoint: 'login-user',
    windowDurationInMinutes: 0.5, // 30 seconds
    requestLimit: 2, // Limit each IP to 2 requests per 30 seconds
    statusCode: 429, // HTTP status code for rate limit exceeded
    ErrorMessage: 'Too many requests from your IP. Please try again later.',
  }),
};

module.exports.sendOtpMiddlewares = {
  expressRateLimiterMiddleware: expressRateLimiterMiddleware({
    endpoint: 'send-otp',
    windowDurationInMinutes: 0.5, // 30 seconds
    requestLimit: 2, // Limit each IP to 2 requests per 30 seconds
    statusCode: 429, // HTTP status code for rate limit exceeded
    ErrorMessage: 'Too many requests from your IP. Please try again later.',
  }),
};

module.exports.verifyOtpMiddlewares = {
  expressRateLimiterMiddleware: expressRateLimiterMiddleware({
    endpoint: 'verify-otp',
    windowDurationInMinutes: 0.5, // 30 seconds
    requestLimit: 2, // Limit each IP to 2 requests per 30 seconds
    statusCode: 429, // HTTP status code for rate limit exceeded
    ErrorMessage: 'Too many requests from your IP. Please try again later.',
  }),
};