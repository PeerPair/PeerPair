'use strict';

const server = require('./src/server');
require('dotenv').config();
const mongoose = require('mongoose');


// Connect to mongoose database then start the server
mongoose
  .connect(process.env.MONGOOSE_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.start(process.env.PORT);
  })
  .catch((e) => {
    console.log('CONNECTION_ERROR', e.massage);
  });
