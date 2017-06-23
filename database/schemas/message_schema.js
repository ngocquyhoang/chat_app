'use strict';

var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var messageSchema = new Schema({
  'user_id' : String,
  'room_id' : String,
  'content' : String,
  'create_at' : Date
});

module.exports = Mongoose.model('message', messageSchema);
