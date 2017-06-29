'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Environment Variables
var dotenv = require('dotenv');
dotenv.load();

// Message Model
var Message = require('./models/messageModel');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Routes
var index = require('./routes/index');
// var users = require('./routes/users');

// Express
var app = express();

// Socket.io
app.io = require('socket.io')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
// app.use('/users', users);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// Socket.io events
app.io.on('connection', function(socket){  
  console.log('A user connected');

  socket.on('new message', function(new_message){
    var message_params = { user_id : '', room_id : '', content : new_message, create_at : Date.now() };

    Message.create( message_params, function( error, message ){
      if( error ) { 
        app.io.emit( 'notify', error.errors.content.message, 'success' );
      } else {
        app.io.emit( 'chat message', message.content );
      }
    })
  });

  Message.list ( function( err, list_messages ) {
    if( err ) throw err;
    list_messages.forEach( function( item, index) {
      app.io.emit('chat message', item.content);
    });
  });

  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
});

module.exports = app;
