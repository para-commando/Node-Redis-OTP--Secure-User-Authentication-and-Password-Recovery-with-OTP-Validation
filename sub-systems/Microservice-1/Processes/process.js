const logger = require('../../../shared/src/configurations/logger.configurations');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const redisClient = require('../../../shared/src/configurations/redis.configurations.js');
const twilioSmsClient = require('../../../shared/src/configurations/twilioServices.configurations');
module.exports.Processes = {
    verifyOtp: async ({ phoneNo, otp }) => {
        try {
            // Check if the user with the given phone number exists
            const isExistingUser = await redisClient.exists(`user:${phoneNo}`);
            if (isExistingUser !== 1) {
                throw {
                    status: 401,
                    message: 'Unauthorized',
                    error: 'Incorrect phone number or User does not exist',
                };
            }
    
            // Check if an OTP has been sent for the given phone number
            const isOtpAlreadySent = await redisClient.exists(`user:${phoneNo}:otp`);
            if (isOtpAlreadySent !== 1) {
                throw {
                    status: 403,
                    message: 'Forbidden',
                    error: 'Please generate a new OTP',
                };
            }
    
            // Check if the OTP is available for a sufficient amount of time
            const timeLeftForOtpToExpire = await redisClient.ttl(`user:${phoneNo}:otp`);
            const isOtpAvailableForSufficientTime = timeLeftForOtpToExpire > 5;
    
            if (isOtpAlreadySent === 1 && isOtpAvailableForSufficientTime) {
                // Retrieve the already generated OTP
                const alreadyGeneratedOtp = await redisClient.get(`user:${phoneNo}:otp`);
    
                if (alreadyGeneratedOtp === otp) {
                    // Set a flag indicating that the user is allowed to change the password
                    await redisClient.set(`user:${phoneNo}:allowedToChangePassword`, 1);
    
                    // Set the expiration time for the flag
                    await redisClient.expire(`user:${phoneNo}:allowedToChangePassword`, 500);
                    const ttl = await redisClient.ttl(`user:${phoneNo}:allowedToChangePassword`);
    
                    // Fetch the username associated with the phone number
                    const fetchUserName = await redisClient.hGet(`user:${phoneNo}`, 'userName');
    
                    // Send an SMS to the user with the username and a link to reset the password
                    const twilioResponse = await twilioSmsClient.messages.create({
                        body: `Your Username is ${fetchUserName} and link to reset your password is http://localhost:3000/routes/userAuthentication/reset-Password which will expire in ${ttl} seconds from now`,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: `+91${phoneNo}`,
                    });
    
                    return {
                        message: `otp:${alreadyGeneratedOtp} verified successfully, you have ${ttl} seconds left to change your password. Your userName and link to reset password has been sent as an SMS to you`,
                    };
                } else {
                    // Check if the failed attempt key exists in Redis
                    const isFailedAttemptKeyPresent = await redisClient.exists(
                        `user:${phoneNo}:numberOfFailedOtpValidationAttempts`
                    );
    
                    if (isFailedAttemptKeyPresent === 1) {
                        // Increment the number of failed OTP validation attempts
                        await redisClient.incrBy(
                            `user:${phoneNo}:numberOfFailedOtpValidationAttempts`,
                            1
                        );
    
                        // Get the number of failed attempts
                        const numberOfFailedAttempts = await redisClient.get(
                            `user:${phoneNo}:numberOfFailedOtpValidationAttempts`
                        );
    
                        if (numberOfFailedAttempts > 2) {
                            // Delete the OTP and the failed attempt key
                            await redisClient.del(`user:${phoneNo}:otp`);
                            await redisClient.del(
                                `user:${phoneNo}:numberOfFailedOtpValidationAttempts`
                            );
    
                            throw {
                                status: 403,
                                message: 'Forbidden',
                                error:
                                    'OTP expired due to the maximum number of failed attempts. Please generate a new OTP',
                            };
                        }
                    } else {
                        // Set the failed attempt key and its expiration time
                        await redisClient.set(
                            `user:${phoneNo}:numberOfFailedOtpValidationAttempts`,
                            1
                        );
                        await redisClient.expire(
                            `user:${phoneNo}:numberOfFailedOtpValidationAttempts`,
                            30
                        );
                    }
    
                    throw {
                        status: 400,
                        message: 'Bad Request',
                        error: 'Incorrect OTP',
                    };
                }
            } else {
                throw {
                    status: 403,
                    message: 'Forbidden',
                    error: 'OTP expired. Please generate a new OTP',
                };
            }
        } catch (error) {
            throw error;
        }
    },
    
    sendOtp: async ({ phoneNo }) => {
        try {
            // Check if the user with the given phone number exists
            const isExistingUser = await redisClient.exists(`user:${phoneNo}`);
            if (isExistingUser !== 1) {
                throw {
                    status: 401,
                    message: 'Unauthorized',
                    error: 'Incorrect phone number or User does not exist',
                };
            }
    
            // Check if an OTP has already been sent for the given phone number
            const isOtpAlreadySent = await redisClient.exists(`user:${phoneNo}:otp`);
            if (isOtpAlreadySent === 1) {
                // Retrieve the already generated OTP and its time-to-live (TTL)
                const alreadyGeneratedOtp = await redisClient.get(`user:${phoneNo}:otp`);
                const ttl = await redisClient.ttl(`user:${phoneNo}:otp`);
    
                // Send the OTP via Twilio SMS
                const twilioResponse = await twilioSmsClient.messages.create({
                    body: `otp:${alreadyGeneratedOtp} expires in ${ttl} seconds`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phoneNo}`,
                });
    
                return {
                    message: `otp:${alreadyGeneratedOtp} expires in ${ttl} seconds`,
                };
            } else {
                // Generate a new OTP and store it in Redis
                const otp = generateOTP();
                await redisClient.set(`user:${phoneNo}:otp`, otp);
    
                // Set the expiration time for the OTP
                await redisClient.expire(`user:${phoneNo}:otp`, 60);
                const ttl = await redisClient.ttl(`user:${phoneNo}:otp`);
    
                // Send the OTP via Twilio SMS
                const twilioResponse = await twilioSmsClient.messages.create({
                    body: `otp:${otp} expires in ${ttl} seconds`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phoneNo}`,
                });
    
                return { message: `otp:${otp} expires in ${ttl} seconds` };
            }
        } catch (error) {
            throw error;
        }
    },
    
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
