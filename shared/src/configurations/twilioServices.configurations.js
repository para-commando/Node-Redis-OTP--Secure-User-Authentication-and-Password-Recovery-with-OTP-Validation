require('dotenv').config();

const twilioSmsClient = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

module.exports = twilioSmsClient