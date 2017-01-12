
const assert = require('assert');
const lodash = require('lodash');
const logger = require('winston');
const multiExecAsync = require('../components/multiExecAsync');
const config = require('../components/config')(require('./config.meta'));
const redis = require('../components/redisAsync')(config);
const getStdin = require('get-stdin');

async function debug() {
    if (process.env.NODE_ENV !== 'production' || config.debug) {
        console.log(...arguments);
    }
}

function getConfigObject(configContent) {
    if (/^\{/.test(configContent)) {
        return JSON.parse(configContent);
    } else if (/^module.exports = \{/.test(configContent)) {
        return require('@f/require-content')(configContent, 'stdin');
    } else {
        throw new Error('Standard input must be JSON or module.exports');
    }

}

async function main() {
    const state = {};
    try {
        state.configContent = await getStdin();
        state.configContent = state.configContent.replace(/[ \t]\n/g, '\n').trim();
        const configObject = getConfigObject(state.configContent);
        console.log({configObject});
        await multiExecAsync(redis, multi => {
            multi.hmset(config.key, configObject);
        });
    } catch (err) {
        console.log({state});
        console.error(err);
    } finally {
        redis.quit();
    }
}

main();
