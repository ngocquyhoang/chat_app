'use strict';

var Room = require('../models/roomModel');

var index = function(req, res) {
  var url = req.params.url;

  Room.isset(url, function (err, count){ 
    if( count > 0 ){
      
    } else {
      url = '5960b5793dd17e0f323b1a68';
    };

    Room.findById(url, function (error, room){
      res.render('dashboard', { title: room.title + ' room', target: url, roomTitle: room.title });
      // if (room) {
      //   res.render('dashboard', { title: room.title + ' room', target: url, roomTitle: room.title });
      // } else {
      //   res.render('dashboard', { title: 'Express dashboard', target: url, roomTitle: 'xxx' });
      // };
    });
  });
};

module.exports = { index }
