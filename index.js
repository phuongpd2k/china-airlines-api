const express = require('express');
const one_way_process = require('./service/one_way.js');
const {getCookie } = require('./job/get_cookie.js');
const setCookie  = require('./service/set_cookie.js');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.text());
app.post('/api/one_way', async (req, res) => {
    const responseData = await one_way_process(req);
    res.json(responseData);
});
app.post('/api/set_cookie', async (req, res) => {
  const requestBody = req.body;
  await setCookie(requestBody);
  res.json('Success');
});
const PORT = 3000; // Choose the port you want your API to listen on
app.listen(PORT,async () => {
  await getCookie();
  console.log(`Server is running on port ${PORT}`);
});