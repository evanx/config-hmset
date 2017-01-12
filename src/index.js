
const assert = require('assert');
const lodash = require('lodash');
const logger = require('winston');
const multiExecAsync = require('../components/multiExecAsync');
const config = require('../components/config')(require('./config.meta'));
const redis = require('../components/redisAsync')(config);
const getStdin = require('get-stdin');

main();

async function main() {
    const state = {};
    try {
        const content = await getStdin();
        const object = parse(content);
        await multiExecAsync(redis, multi => {
            if (config.clean) {
                multi.del(config.key);
            }
            Object.keys(object).forEach(key => {
                multi.hset(config.key, key, stringify(object[key]));
            });
            if (config.expire > 0) {
                multi.expire(config.key, config.expire);
            }
        });
        const [hgetall] = await multiExecAsync(redis, multi => {
            multi.hgetall(config.key);
        });
        console.log(config.key, hgetall);
    } catch (err) {
        console.error(err);
    } finally {
        redis.quit();
    }
}

function parse(content) {
    content = content.replace(/[ \t]\n/g, '\n').trim();
    if (/^\{/.test(content)) {
        return JSON.parse(content);
    } else if (/^module.exports = \{/.test(content)) {
        return require('@f/require-content')(content, 'stdin');
    } else {
        throw new Error('Standard input must be JSON or JS with module.exports');
    }
}

function stringify(value) {
    if (typeof value === 'object') {
        return JSON.stringify(value);
    } else {
        return value;
    }
}

function debug() {
    if (process.env.NODE_ENV !== 'production' || config.debug) {
        console.log(...arguments);
    }
}
