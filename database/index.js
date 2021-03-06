'use strict';

var Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI);

Mongoose.connection.on('error', function(err) {
  console.log(err);
});

module.exports = { Mongoose, 
  models: {
    message: require('./schemas/message_schema.js'),
    room: require('./schemas/room_schema.js')
  }
};
