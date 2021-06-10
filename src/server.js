// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');

// Esoteric Resources
const errorHandler = require('./middleware/500.js');
const notFound = require('./middleware/404.js');
const authRoutes = require('./auth/routes.js');
const requestRoutes = require('./routes/request.js');
// Prepare the express app
const app = express();
const multerParse = multer();

// App Level MW
app.use(multerParse.none());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// Routes
app.use(authRoutes);
app.use('/request', requestRoutes);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
