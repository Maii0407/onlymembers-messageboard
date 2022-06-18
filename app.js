const dotenv = require( 'dotenv' );
dotenv.config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require( 'express-session' );
const passport = require( 'passport' );
const LocalStrategy = require( 'passport-local' ).Strategy;
const bcrypt = require( 'bcryptjs' );

const User = require( './models/user' );

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

passport.use(
  new LocalStrategy(
    { usernameField: 'userID-login', passwordField: 'userPassword-login' },
    ( username, password, done ) => {
    User.findOne({ userID: username }, ( err, user ) => {
      if( err ) { return done( err ); }
      if( !user ) {
        return done( new Error( 'Incorrect UserID' ));
      }

      bcrypt.compare( password, user.password, ( err, res ) => {
        if( res ) {
          return done( null, user );
        }
        
        return done( new Error( 'Incorrect Password' ))
      })
    }) 
  })
);

passport.serializeUser( ( user, done ) => {
  done( null, user.id );
});

passport.deserializeUser( ( id, done ) => {
  User.findById( id, ( err, user ) => {
    done( err, user );
  });
});

const app = express();

const mongoose = require( 'mongoose' );
const mongoDB = `${ process.env.MONGODB }`;
mongoose.connect( mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on( 'error', console.error.bind( console, 'MONGODB connection error' ));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use( session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use( ( req, res, next ) => {
  res.locals.currentUser = req.user;
  next();
});

app.use( passport.initialize());
app.use( passport.session());
app.use( express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
