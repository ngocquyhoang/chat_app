'use strict';

var Mongoose = require('mongoose');
var Schema   = Mongoose.Schema;
var PassportLocalMongoose = require('passport-local-mongoose');
var UniqueValidator = require('mongoose-unique-validator');
var Validator = require('validator');

var userSchema = new Schema({
  'email' : {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  'password' : String,
  'name' : String,
  'avatar' : String,
  ''
  'create_at' : Date
});

userSchema.plugin(PassportLocalMongoose);
userSchema.plugin(UniqueValidator);

module.exports = Mongoose.model('user', userSchema);
