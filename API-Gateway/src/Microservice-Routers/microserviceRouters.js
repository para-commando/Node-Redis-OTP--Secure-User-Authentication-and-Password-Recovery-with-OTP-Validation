const app = require('../app');
const {
  registerUserMiddlewares
} = require('../Middlewares/Route-Middlewares/expressRateLimit.middleware');
const Joi = require('joi');
const {
  Processes,
} = require('../../../sub-systems/Microservice-1/Processes/process');

const logger = require('../../../shared/src/configurations/logger.configurations');
// API specific Rate-limiting Middleware
app.post(
  '/routes/userAuthentication/register-user',
  registerUserMiddlewares.expressRateLimiterMiddleware,
  async (req, res, next) => {
    try {
      const schema = Joi.object({
        userName: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).max(30).required(),
        email: Joi.string().email().required(),
        phoneNo: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
      });
      const validatedData = schema.validate(req.body);
      if (validatedData?.error) {
        throw {
          status: 400,
          message: 'Bad Request',
          error: validatedData?.error,
        };
      } else {
        const { userName, email, password, phoneNo } = validatedData.value;
        const response = await Processes.createNewUser({
          userName: userName,
          email: email,
          password: password,
          phoneNo: phoneNo,
        });
        logger.info('🚀response: ', response);
        res.status(200).json({
          responseData: response,
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
