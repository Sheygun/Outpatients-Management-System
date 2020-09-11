var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser')
var expressValidator = require('express-validator');
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const path = require('path')
var createError = require('http-errors')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var fs = require('fs')
const multer = require('multer');
const flash = require('express-flash');
var session = require('express-session');
var passport = require('passport');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var admin = require('./routes/admin');
require('./routes/auth')(passport);

var app = express();

const dbName = 'samdos';
// const connectionString = 'mongodb://localhost:27017/' + dbName;
const connectionString = 'mongodb://xxx:xxx@ds123196.mlab.com:23196/'+dbName;

mongoose.connect(connectionString, { useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  name: 'sheygun',
  secret: 'samdos',
  resave: true,
  saveUninitialized: true,
      store: new MongoStore({
        uri: connectionString,
        databaseName: dbName,
        collection: 'users-session'
    })
}));

app.use(flash(app));

// express validator
// app.use(expressValidator())

//// passport init
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen( () => console.log(`Listening to Server`))

module.exports = app;
