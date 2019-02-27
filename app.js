var createError = require('http-errors');
var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require("body-parser");
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');
//let connect  = require('connect');

mongoose.connect("mongodb://127.0.0.1:27017/CMS");
let db = mongoose.connection.on('open' , function () {
    console.log("connected and done");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

//app.use(connect.bodyParser());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



// Validator
/*app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));*/
///////////////////////////////////////////////////

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin' , adminRouter);

// error handler
app.use(function(err, req, res, next) {
  res.json({
    status : 400 ,
    msg : "error occurred" ,
    error : err
  })
});

module.exports = app;
