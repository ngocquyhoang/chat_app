'use strict';

var roomModel = require('../database').models.room;

var create = function (data, callback){
  var newRoom = new roomModel(data);
  newRoom.save(callback);
};

var list = function(callback){
  roomModel.find().sort({ create_at: 'ascending'}).exec(callback);
};

var isset = function (data_id, callback){
  roomModel.count({ _id: data_id }).exec(callback);
};

var findById = function (data_id, callback){
  roomModel.findById(data_id).exec(callback);
};

module.exports = { create, list, findById, isset };
