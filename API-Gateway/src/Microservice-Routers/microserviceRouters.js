const app = require('../app');
const {
  myEndPointMiddlewares
} = require('../Middlewares/Route-Middlewares/expressRateLimit.middleware');
const Joi = require('joi');
const {
  processes,
} = require('../../../sub-systems/Microservice-1/Processes/process');

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
        const response = await processes.coreProcess1(validationResult.value);
        
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
