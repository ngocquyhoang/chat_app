'use strict';

var Room = require('../models/roomModel');

var index = function(req, res) {
  var url = req.params.url;

  Room.isset(url, function (err, count){ 
    if( count > 0 ){
      
    } else {
      url = '59557f3c02e385223174dff9';
    };

    Room.findById(url, function (error, room){
      res.render('dashboard', { title: 'Express dashboard', target: url, roomTitle: room.title });
    });
  });
};

module.exports = { index }
