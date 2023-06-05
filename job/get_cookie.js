const { schedule } = require('node-cron');
const InternalCache = require('../service/internal_cache.js');
const fs = require('fs');
const cache = new InternalCache();
async function getCookie() {
    // Schedule a cron job to run every minute
    schedule('* * * * * *', () => {
        // Specify the path to the JavaScript file
        const filePath = './config/cookie';

        // Read the file asynchronously
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            cache.setData('memCookie', data);
            const currentTime = new Date();
            console.log(`${currentTime} memCookie is saved`);
        });
    });
}

module.exports = {
    cache: cache,
    getCookie: getCookie, // Assign the function reference, don't call it
  };