const logger = require('../../../shared/src/configurations/logger.configurations');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const redisClient = require('../../../shared/src/configurations/redis.configurations.js');

module.exports.Processes = {
  createNewUser: async ({ userName, email, password, phoneNo }) => {
    try {
      // Hash the password using bcrypt
      const hashedPassword = bcrypt.hashSync(
        password,
        Number(process.env.HASHING_ROUNDS)
      );

      // Prepare user details to be stored in Redis
      const userDetails = [
        { fieldName: 'userName', value: userName },
        { fieldName: 'email', value: email },
        { fieldName: 'password', value: hashedPassword },
        { fieldName: 'phoneNo', value: phoneNo },
      ];

      // Check if the username already exists
      const usernameExists = await redisClient.exists(`user:${userName}`);
      if (usernameExists) {
        throw {
          status: 409,
          message: 'Conflict',
          error: 'Username already exists',
        };
      }

      // Store user details in Redis
      for (const userData of userDetails) {
        await redisClient.hSet(
          `user:${userName}`,
          userData.fieldName,
          userData.value
        );
      }

      // Set username and password into a separate field for forgot password authentication
      await redisClient.hSet(`user:${phoneNo}`, 'userName', userName);
      await redisClient.hSet(`user:${phoneNo}`, 'password', hashedPassword);

      return { message: 'User registered successfully' };
    } catch (error) {
      throw error;
    }
  },
};
