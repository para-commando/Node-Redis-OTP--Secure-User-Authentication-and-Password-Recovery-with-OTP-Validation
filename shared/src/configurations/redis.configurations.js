const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
        host: 'localhost',
        port: '6379'
    },
   
});
redisClient.connect();

module.exports = redisClient;
