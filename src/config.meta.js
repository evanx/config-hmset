module.exports = {
    key: {
        description: 'the hashes key',
        example: 'my-config-key:h'
    },
    redisHost: {
        description: 'the Redis host',
        example: 'localhost'
    },
    level: {
        default: 'info',
        description: 'logging level',
        options: ['debug', 'info', 'warn', 'error']
    },
    debug: {
        default: false,
        description: 'verbose debugging'
    }
};
