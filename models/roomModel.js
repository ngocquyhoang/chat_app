'use strict';

var roomModel = require('../database').models.room;

var create = function (data, callback){
  var newRoom = new roomModel(data);
  newRoom.save(callback);
};

var list = function(callback){
  var listRooms = roomModel.find(callback);
};

var isset = function (data_id, callback){
  roomModel.count({ _id: data_id }, callback);
};

var findById = function (data_id, callback){
  roomModel.findById(data_id, callback);
};

module.exports = { create, list, findById, isset };
