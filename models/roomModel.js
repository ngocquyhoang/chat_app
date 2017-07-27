'use strict';

var Room = require('../database').schemas.room;

var create = function (data, callback){
  var newRoom = new Room(data);
  newRoom.save(callback);
};

var list = function(callback){
  Room.find().sort({ create_at: 'ascending'}).exec(callback);
};

var isset = function (data_id, callback){
  Room.count({ _id: data_id }).exec(callback);
};

var findById = function (data_id, callback){
  Room.findById(data_id).exec(callback);
};

module.exports = { create, list, findById, isset };
