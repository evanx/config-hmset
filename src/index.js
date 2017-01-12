
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
            Object.keys(object).forEach(key => {
                const value = object[key];
                if (typeof value === 'object') {
                    multi.hset(config.key, key, JSON.stringify(value));
                } else {
                    multi.hset(config.key, key, value);
                }
            });
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

function debug() {
    if (process.env.NODE_ENV !== 'production' || config.debug) {
        console.log(...arguments);
    }
}
