'use strict';

var Message = require('../database').schemas.message;

var create = function (data, callback){
  var newMessage = new Message(data);
  newMessage.save(callback);
};

var list = function(callback){
  Message.find().exec(callback);
}

var findbyRoom = function(room_id, callback) {
  Message.find({ room_id: room_id }).sort({ create_at: 'ascending'}).exec(callback);
}

var lastMessageinRoom = function(room_id, callback) {
  Message.find({ room_id: room_id }).sort({ create_at: 'descending'}).limit(1).exec(callback);
}

module.exports = { create, list, findbyRoom, lastMessageinRoom };
