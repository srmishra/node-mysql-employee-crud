var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');

var routes = require('./routes/index');
var employees = require('./routes/employees');

var app = express();

var connection  = require('express-myconnection'); 
var mysql = require('mysql');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));

//Flash Messages
var flash = require('connect-flash');
app.use(flash());

var session = require('express-session');
app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));

var exp_msg = require('express-messages');

// Make our db accessible to our router
app.use(function(req,res,next){
  res.locals.flash_messages = req.flash();
  next();
});

//Databse Connection
app.use(    
  connection(mysql,{
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_employees'
  }, 'pool') //or single
);

//Routes
app.use('/', routes);
app.use('/employees', employees);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;