const cache = require('../config/cache.js');

class InternalCache {
    getData(key) {
        return cache.getData(key);
    }

    setData(key, value) {
        cache.setData(key, value);
    }
}
module.exports = InternalCache;
