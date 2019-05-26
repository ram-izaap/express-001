const _ = require("lodash");
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Promise = require("bluebird");
const request = require('request-promise');
const jwt = require('jsonwebtoken');
const rfs = require('rotating-file-stream');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require("passport");
// It's a middleware logger for request and response object. Do not mix up with the application log
const logger = require('morgan');
// custom objects
const configservice = require('./services/configservice');
const log4jservice = require('./services/log4jservice');
// custom jwt configure object
const jwtservice = require('./services/jwtservice');
const router = express.Router();

// Routers for our application
const auth = require('./routes/auth');
const api = require('./routes/api');
const indexRouter = require('./routes/index');

// Start of Log file configurations for Morgan
const logDirectory = path.join(__dirname, 'log');
//ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
//create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory
});
//End of Log file configurations for Morgan

// Initialize the ExpressJS application
const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3006'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// setup the Morgan logger
app.use(logger('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());


app.use('/', indexRouter);

// map all the objects
app.use('/auth', auth);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if(err && err.status == 404){
    res.status(404);
    res.locals.message = err.message;
    res.locals.error = err;
    res.render('error');
  }

});

module.exports = app;
