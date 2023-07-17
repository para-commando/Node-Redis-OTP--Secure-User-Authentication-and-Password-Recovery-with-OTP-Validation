const logger = require('../../../shared/src/configurations/logger.configurations');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const redisClient = require('../../../shared/src/configurations/redis.configurations.js');

module.exports.Processes = {
    loginUser: async ({ userName, password }) => {
        try {
            const maxFailedAttempts = 5; // Maximum number of allowed failed login attempts
            const accountLockDurationInSeconds = 30; // Duration in seconds for which an account is locked
            const maxFailedAttemptsDurationInSeconds = 30; // Duration in seconds for which failed login attempts are tracked
    
            // Check if the user account is temporarily locked due to exceeded failed attempts
            const isUserAccountLockedTemporarily = await redisClient.exists(
                `user:${userName}:NoOfFailedAttemptsExceeded`
            );
            if (isUserAccountLockedTemporarily === 1) {
                const ttl = await redisClient.ttl(
                    `user:${userName}:NoOfFailedAttemptsExceeded`
                );
                throw {
                    status: 423,
                    message: `Locked`,
                    error: `Account Locked for exceeded failed attempts, try again after ${ttl} seconds`,
                };
            }
    
            // Check if the username exists in the Redis store
            const usernameExists = await redisClient.exists(`user:${userName}`);
            if (usernameExists) {
                // Retrieve the saved password and username from Redis
                const userSavedPassword = await redisClient.hGet(
                    `user:${userName}`,
                    'password'
                );
                const userSavedUserName = await redisClient.hGet(
                    `user:${userName}`,
                    'userName'
                );
    
                // Compare the entered password with the saved password
                const isPasswordValid = await bcrypt.compare(
                    password,
                    userSavedPassword
                );
    
                // Check if the entered username matches the saved username
                const isUserNameValid = userSavedUserName === userName;
    
                // Check if the entered credentials (username and password) are valid
                const doCredentialsMatch = isUserNameValid && isPasswordValid;
    
                if (doCredentialsMatch) {
                    return { message: 'User Logged-In successfully' };
                } else {
                    const userFailedLoginKey = `user:${userName}:NoOfFailedAttempts`;
    
                    // Check if the failed login key exists in Redis
                    const isUserFailedLoginKeyExists = await redisClient.exists(
                        userFailedLoginKey
                    );
    
                    if (isUserFailedLoginKeyExists === 1) {
                        // Increment the failed login attempts count
                        const failedAttemptsCount = await redisClient.incr(
                            userFailedLoginKey
                        );
    
                        if (failedAttemptsCount >= maxFailedAttempts) {
                            // Delete the failed login key and set the account lock key
                            await redisClient.del(userFailedLoginKey);
                            await redisClient.set(
                                `user:${userName}:NoOfFailedAttemptsExceeded`,
                                1
                            );
    
                            // Set the expiration time for the account lock key
                            await redisClient.expire(
                                `user:${userName}:NoOfFailedAttemptsExceeded`,
                                accountLockDurationInSeconds
                            );
                            const ttl = await redisClient.ttl(
                                `user:${userName}:NoOfFailedAttemptsExceeded`
                            );
                            throw {
                                status: 423,
                                message: `Account Locked for exceeded failed attempts, try again after ${ttl} seconds`,
                                error: 'Invalid password',
                            };
                        }
                    } else {
                        // Set the failed login key and its expiration time
                        await redisClient.set(userFailedLoginKey, 1);
                        await redisClient.expire(
                            userFailedLoginKey,
                            maxFailedAttemptsDurationInSeconds
                        );
                    }
                    throw {
                        status: 400,
                        message: 'Bad Request',
                        error: 'Invalid password',
                    };
                }
            } else {
                throw {
                    status: 401,
                    message: 'Unauthorized',
                    error: 'Invalid username or New user',
                };
            }
        } catch (error) {
            throw error;
        }
    },
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
