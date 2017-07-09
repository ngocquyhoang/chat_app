'use strict';

var messageModel = require('../database').models.message;

var create = function (data, callback){
  var newMessage = new messageModel(data);
  newMessage.save(callback);
};

var list = function(callback){
  messageModel.find().exec(callback);
}

var findbyRoom = function(room_id, callback) {
  messageModel.find({ room_id: room_id }).sort({ create_at: 'ascending'}).exec(callback);
}

var lastMessageinRoom = function(room_id, callback) {
  messageModel.find({ room_id: room_id }).sort({ create_at: 'descending'}).limit(1).exec(callback);
}

module.exports = { create, list, findbyRoom, lastMessageinRoom };
