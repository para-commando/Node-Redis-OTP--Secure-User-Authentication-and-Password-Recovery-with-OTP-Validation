const app = require('../app');
const {
  myEndPointMiddlewares,myEndPoint2Middlewares, myEndPoint3Middlewares
} = require('../Middlewares/Route-Middlewares/expressRateLimit.middleware');
const Joi = require('joi');
const {
  processMappers,
} = require('../../../sub-systems/Microservice-1/Process-Mappers/processMappers');
const {
  processMappers:processMappers2,
} = require('../../../sub-systems/Microservice-2/Process-Mappers/processMappers');
const {
  processMappers: processMappers3,
} = require('../../../sub-systems/Microservice-3/Process-Mappers/processMappers');
const logger = require('../../../shared/src/configurations/logger.configurations');
// API specific Rate-limiting Middleware
app.post(
  '/myEndPoint',
  myEndPointMiddlewares.expressRateLimiterMiddleware,
  async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().valid('Anirudh', 'Nayak').default(null),
        demand: Joi.string()
          .valid('Highest', 'High', 'Medium', 'Low')
          .default(null),
        myTaskStatus: Joi.string()
          .valid('Not Started', 'In Progress', 'Completed', 'Unassigned')
          .default(null),
      });
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        logger.warn('This is a warning message.');
        logger.error('This is an error message.');

        res.sendStatus(400);
      } else {
        const response = await processMappers.process1(validationResult.value);
        
        logger.info("🚀 ~ file: microserviceRouters.js:31 ~ response:", response);
        res.json({
          response: response,
        });
      }
    } catch (error) {
      logger.error('This is an error message.');

      res.status(400).json({ error: error });
    }
  }
);
app.post(
  '/myEndPoint2',
  myEndPoint2Middlewares.expressRateLimiterMiddleware,
  async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().valid('Anirudh', 'Nayak').default(null),
        demand: Joi.string()
          .valid('Highest', 'High', 'Medium', 'Low')
          .default(null),
        myTaskStatus: Joi.string()
          .valid('Not Started', 'In Progress', 'Completed', 'Unassigned')
          .default(null),
      });
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        logger.warn('This is a warning message.');
        logger.error('This is an error message.');

        res.sendStatus(400);
      } else {
        const response = await processMappers2.process1(validationResult.value);
        
        logger.info("🚀 ~ file: microserviceRouters.js:31 ~ response:", response);
        res.json({
          response: response,
        });
      }
    } catch (error) {
      logger.error('This is an error message.');

      res.status(400).json({ error: error });
    }
  }
);
app.post(
  '/myEndPoint3',
  myEndPoint3Middlewares.expressRateLimiterMiddleware,
  async (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().valid('Anirudh', 'Nayak').default(null),
        demand: Joi.string()
          .valid('Highest', 'High', 'Medium', 'Low')
          .default(null),
        myTaskStatus: Joi.string()
          .valid('Not Started', 'In Progress', 'Completed', 'Unassigned')
          .default(null),
      });
      const validationResult = schema.validate(req.body);
      if (validationResult.error) {
        logger.warn('This is a warning message.');
        logger.error('This is an error message.');

        res.sendStatus(400);
      } else {
        const response = await processMappers3.process1(validationResult.value);
        
        logger.info("🚀 ~ file: microserviceRouters.js:31 ~ response:", response);
        res.json({
          response: response,
        });
      }
    } catch (error) {
      logger.error('This is an error message.');

      res.status(400).json({ error: error });
    }
  }
);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
