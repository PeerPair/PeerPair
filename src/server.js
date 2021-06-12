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
const explore = require('./routes/explore');
const search = require('./routes/search')
const submitRout = require('./routes/submit')
const profileRout = require('./routes/profile')
const acceptRout = require('./routes/accept');
const allRequestRout = require('./routes/all-request');
const homeRout = require('./routes/home-rout');


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
app.use(requestRoutes);
app.use(submitRout);
app.use(profileRout);
app.use(acceptRout);
app.use(allRequestRout);
app.use(homeRout);


app.use(explore);
app.use(search)
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
