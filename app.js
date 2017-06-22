var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Environment Variables
var dotenv = require('dotenv');
dotenv.load();

// Mongo DB
var MongoClient = require('mongodb').MongoClient;
var MongoUrl = process.env.DB_MONGO_URL;

// Routes
var index = require('./routes/index');
var users = require('./routes/users');

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
app.use('/users', users);

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

  socket.on('new message', function(msg){
    console.log('new message: ' + msg);

    MongoClient.connect( MongoUrl , function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', MongoUrl);

        var collection = db.collection('messages');
        collection.insert({ content: msg }, function(err, o) {
          if (err) { 
            console.log(err.message); 
          }else { 
            console.log("chat message inserted into db: " + msg); 
          }
        });
      }
    })

    app.io.emit('chat message', msg);
  });

  MongoClient.connect( MongoUrl , function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Connection established to', MongoUrl);

      var collection = db.collection('messages')
      var stream = collection.find().sort().limit(10).stream();
      stream.on('data', function (chat) { socket.emit('chat message', chat.content); });
    }
  });

  socket.on('disconnect', function () {
    console.log('User disconnected');
  });
});

module.exports = app;
