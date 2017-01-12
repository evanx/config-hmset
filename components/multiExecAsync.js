
const Promise = require('bluebird');

module.exports = (client, multiFunction) => {
    const multi = client.multi();
    multiFunction(multi);
    return Promise.promisify(multi.exec).call(multi);
};
