
const InternalCache = require('../service/internal_cache.js');
const cache = new InternalCache();
async function setCookie(data) {
    cache.setData('memCookie', data);
    const currentTime = new Date();
    console.log(`${currentTime} memCookie is saved`);
}
module.exports = {
    setCookie: setCookie,
    cache: cache
}