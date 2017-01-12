
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

function createClient(config) {
    if (config.redisUrl) {
        return redis.createClient(config.redisUrl);
    } else if (config.redisHost && !config.redisPort) {
        return redis.createClient(6379, config.redisHost);
    }
    throw new Error('Redis config');
}

module.exports = config => createClient(config);
