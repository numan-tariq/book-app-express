// Loading env
require('dotenv').config();

// Imports
const express = require('express');
const http = require('http');

// Express App
const app = express();

// MiddleWares
app.use(express.json());

// DB
require('./startup/db')();

// Routes
require('./routes')(app);

app.use('', (req, res, next) => {
  return res.status(200).send('<h1>Express server is running here.</h1>');
});


// Express app listener
const server = http.createServer(app);
const port = process.env.port || 4001;
server.listen(port, () => {
  console.log(`Express server is running on port: ${port}`);
})

function apiCall(resolve, reject) {
  if(Math.floor(Math.random()*1)) {
    resolve({ message: 'OK'});
  } else {
    reject({ message: 'Rejected'});
  }
}