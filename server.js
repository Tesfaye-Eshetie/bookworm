const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const session = require('express-session');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;
const app = express();

// use sessions for tracking logins
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false
}));

// make user ID available in templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId;
  next();
});

connectDB();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
app.use('/', require('./routes/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
