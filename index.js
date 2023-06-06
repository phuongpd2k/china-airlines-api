const express = require('express');
const one_way_process = require('./service/one_way.js');
const round_way_process = require('./service/round_way.js');
const {set_cookie}  = require('./service/set_cookie.js');
const {crawl_cookie,init_cookie} = require('./job/crawl_cookie.js');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.text());
app.post('/api/one_way', async (req, res) => {
    const responseData = await one_way_process(req);
    res.json(responseData);
});
app.post('/api/round_way', async (req, res) => {
  const responseData = await round_way_process(req);
  res.json(responseData);
});
app.post('/api/set_cookie', async (req, res) => {
  const requestBody = req.body;
  await set_cookie(requestBody);
  res.json('Success');
});
const PORT = 3000; // Choose the port you want your API to listen on
app.listen(PORT,async () => {
  // init_cookie();
  // crawl_cookie();
  console.log(`Server is running on port ${PORT}`);
});