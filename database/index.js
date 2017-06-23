'use strict';

var Mongoose = require('mongoose');
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.DB_MONGO_URL);

Mongoose.connection.on('error', function(err) {
  console.log(err);
});

module.exports = { Mongoose, 
  models: {
    message: require('./schemas/message_schema.js')
  }
};
