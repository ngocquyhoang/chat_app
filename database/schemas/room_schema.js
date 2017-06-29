'use strict';

var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;

var roomSchema = new Schema({
  'title' : String,
  'password' : String,
  'create_at' : Date
});

module.exports = Mongoose.model('room', roomSchema);
