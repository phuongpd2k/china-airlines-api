
const InternalCache = require('../service/internal_cache.js');
const cache = new InternalCache();
async function set_cookie(data) {
    cache.setData('memCookie', data);
    const currentTime = new Date();
    console.log(`${currentTime} memCookie is saved`);
}
module.exports = {
    set_cookie: set_cookie,
    cache: cache
}