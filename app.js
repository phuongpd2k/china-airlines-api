const express = require('express');
const app = express();
const one_way_process = require('./service/one_way.js');
app.use(express.json());
app.post('/api/one_way', async (req, res) => {
    const responseData = await one_way_process(req);
    res.json(responseData);
});
const PORT = 3000; // Choose the port you want your API to listen on
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});