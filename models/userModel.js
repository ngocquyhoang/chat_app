'use strict';

var User = require('../database').schemas.user;

var create = function (data, callback){
  var newUser = new User(data);
  newUser.save(callback);
};

var list = function(callback){
  User.find().sort({ create_at: 'ascending'}).exec(callback);
};

var isset = function (data_id, callback){
  User.count({ _id: data_id }).exec(callback);
};

var findById = function (data_id, callback){
  User.findById(data_id).exec(callback);
};

module.exports = { create, list, findById, isset };
