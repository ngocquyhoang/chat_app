'use strict';

var Message = require('../models/messageModel');
var Room = require('../models/roomModel');
var moment = require('moment');
var momentTZ = require('moment-timezone');


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
