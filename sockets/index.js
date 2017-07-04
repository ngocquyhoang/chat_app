'use strict';

var Message = require('../models/messageModel');
var Room = require('../models/roomModel');
var moment = require('moment');
var momentTZ = require('moment-timezone');
var Bcrypt = require('bcryptjs');

module.exports = function (io) { 
  io.on('connection', function(socket){  
    socket.on('new message', function(room_id, new_message){
      var message_params = { user_id : '', room_id : room_id, content : new_message, create_at : Date.now() };

      Message.create( message_params, function( error, messageReturn ){
        if( !error ) { 
          var messageTime = momentTZ.tz( messageReturn.create_at, "Asia/Ho_Chi_Minh").format('MMMM Do YYYY, h:mm:ss A');
          var messageHtml = '<li class="message-item right-message"><p class="message-time">' + messageTime + '</p><div class="table-panel"><div class="table-child ver-mid"><div class="message-content-box"><p class="message-content">' + messageReturn.content + '</p></div></div><div class="table-child message-user-avatar ver-top"><img src="./images/default-user.png" alt="User name" class="img-circle"></div></div></li>';
          var listMessageTarget = '#listMessages[data-target="' + messageReturn.room_id + '"]';

          io.emit( 'chat message', listMessageTarget, messageHtml );
        }
      })
    });

    socket.on('new room', function(room_title, is_private_room, room_password, room_comfirm_password){
      if ( is_private_room == 'true' ) {
        if (room_password == room_comfirm_password) {
          Bcrypt.genSalt(10, function(err, salt) {
            Bcrypt.hash(room_password, salt, function(err, hash) {
              var room_params = { title: room_title, password: hash, create_at : Date.now() };
              Room.create( room_params, function( error, roomReturn ){
                if( !error ) { 
                  var roomHtml = '<li data-target-id="' + roomReturn._id + '" class="target-item active"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + roomReturn.title + '</h3><p class="chat-status">last message</p></div></div></li>';
                  
                  io.emit( 'add new room', roomHtml );
                };
              });
            });
          });
        };
      } else {
        var room_params = { title: room_title, password: '' };
        Room.create( room_params, function( error, roomReturn ){
          if( !error ) { 
            var roomHtml = '<li data-target-id="' + roomReturn._id + '" class="target-item active"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + roomReturn.title + '</h3><p class="chat-status">last message</p></div></div></li>';
            
            io.emit( 'add new room', roomHtml );
          };
        });
      };
    });

    Room.list ( function( err, list_rooms ) {
      if( err ) throw err;
      list_rooms.forEach( function( itemReturn, index) {
        var roomHtml = '<li data-target-id="' + itemReturn._id + '" class="target-item"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + itemReturn.title + '</h3><p class="chat-status">last message</p></div></div></li>';

        io.emit('add new room', roomHtml);
      });
    });

    Message.list ( function( err, list_messages ) {
      if( err ) throw err;
      list_messages.forEach( function( itemReturn, index) {
        var messageTime = momentTZ.tz( itemReturn.create_at, "Asia/Ho_Chi_Minh").format('MMMM Do YYYY, h:mm:ss A');
        var messageHtml = '<li class="message-item right-message"><p class="message-time">' + messageTime + '</p><div class="table-panel"><div class="table-child ver-mid"><div class="message-content-box"><p class="message-content">' + itemReturn.content + '</p></div></div><div class="table-child message-user-avatar ver-top"><img src="./images/default-user.png" alt="User name" class="img-circle"></div></div></li>';
        var listMessageTarget = '#listMessages[data-target="' + itemReturn.room_id + '"]';

        io.emit('chat message', listMessageTarget, messageHtml);
      });
    });
  });
}
