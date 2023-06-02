const express = require('express');
const one_way_process = require('./service/one_way.js');
const {getCookie } = require('./job/getCookie.js');

const app = express();
app.use(express.json());
app.post('/api/one_way', async (req, res) => {
    const responseData = await one_way_process(req);
    res.json(responseData);
});
const PORT = 3000; // Choose the port you want your API to listen on
app.listen(PORT,async () => {
  await getCookie();
  console.log(`Server is running on port ${PORT}`);
});