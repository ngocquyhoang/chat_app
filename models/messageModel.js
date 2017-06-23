'use strict';

var messageModel = require('../database').models.message;

var create = function (data, callback){
  var newMessage = new messageModel(data);
  newMessage.save(callback);
};

var list = function(callback){
  var listMessages = messageModel.find(callback);
}

module.exports = { create, list };
