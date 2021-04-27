const express = require('express');
const http = require('http');
const routes = require('./routes')

// Express App
const app = express();

// MiddleWares
app.use(express.json());

routes(app);

// Routes
app.use('', (req, res, next) => {
  return res.status(200).send('<h1>Express server is running here.</h1>');
});


// Express app listener
const server = http.createServer(app);
const port = 4000;
server.listen(port, () => {
  console.log(`Express server is running on port: ${port}`);
})