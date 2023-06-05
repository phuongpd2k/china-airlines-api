const fs = require('fs');
async function setCookie(data){
    fs.writeFile("./config/cookie", data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
    
        console.log('Data written to file successfully.');
    });
}
module.exports = setCookie