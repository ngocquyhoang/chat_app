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

          io.emit( 'chat message', listMessageTarget, messageHtml, messageReturn.content );
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
                  var first_message_params = { user_id : '', first_in_room: true, room_id : roomReturn._id, content : 'Lee sin was created "' + roomReturn.title + '" room', create_at : Date.now() };
                  Message.create( first_message_params, function( error, messageReturn ){
                    var roomHtml = '<li data-target-id="' + roomReturn._id + '" onclick="changeRoom(this)" class="target-item"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + roomReturn.title + '</h3><p class="chat-status">' + messageReturn.content + '</p></div></div></li>';
                    
                    io.emit( 'add new room', roomHtml, roomReturn._id, true );
                  })
                }
              })
            })
          })
        }
      } else {
        var room_params = { title: room_title, password: '', create_at : Date.now() };
        Room.create( room_params, function( error, roomReturn ){
          if( !error ) { 
            var first_message_params = { user_id : '', first_in_room: true, room_id : roomReturn._id, content : 'Lee sin was created "' + roomReturn.title + '" room', create_at : Date.now() };
            Message.create( first_message_params, function( error, messageReturn ){
              var roomHtml = '<li data-target-id="' + roomReturn._id + '" onclick="changeRoom(this)" class="target-item"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + roomReturn.title + '</h3><p class="chat-status">' + messageReturn.content + '</p></div></div></li>';
              
              io.emit( 'add new room', roomHtml, roomReturn._id, true );
            })
          }
        })
      }
    });

    socket.on('change room', function (target) {
      Room.findById(target, function(error, room){
        Message.findbyRoom(room._id, function(error, messages){
          var messagesHtml = '';
          var listMessageTarget = '#listMessages[data-target="' + room._id + '"]';
          messages.forEach( function( messageItem, index) {
            var messageTime = momentTZ.tz( messageItem.create_at, "Asia/Ho_Chi_Minh").format('MMMM Do YYYY, h:mm:ss A');
            messagesHtml += '<li class="message-item right-message"><p class="message-time">' + messageTime + '</p><div class="table-panel"><div class="table-child ver-mid"><div class="message-content-box"><p class="message-content">' + messageItem.content + '</p></div></div><div class="table-child message-user-avatar ver-top"><img src="./images/default-user.png" alt="User name" class="img-circle"></div></div></li>';
          })
          io.emit( 'room was change', room, listMessageTarget, messagesHtml );
        })
      });
    });

    Room.list ( function( err, list_rooms ) {
      if( list_rooms[0] ) {
        list_rooms.forEach(function(itemReturn, index) {
          Message.lastMessageinRoom(itemReturn._id, function(error, messages){
            if (messages[0]) {
              var roomHtml = '<li data-target-id="' + itemReturn._id + '" onclick="changeRoom(this)" class="target-item"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + itemReturn.title + '</h3><p class="chat-status">' + messages[0].content + '</p></div></div></li>';
            } else {
              var roomHtml = '<li data-target-id="' + itemReturn._id + '" onclick="changeRoom(this)" class="target-item"><div class="table-panel"><div class="table-child ver-mid user-avatar"><img src="./images/default-user.png" alt="User name" class="img-circle"></div><div class="table-child ver-mid chat-del"><h3 class="user-name">' + itemReturn.title + '</h3><p class="chat-status">Lee sin was created "' + itemReturn.title + '" room</p></div></div></li>';
            }
            io.emit('add new room', roomHtml, itemReturn._id, false);
          })
        });
      }
    })
  })
}
