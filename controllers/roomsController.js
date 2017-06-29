'use strict';

var Room = require('../models/roomModel');

var index = function(req, res) {
  var url = req.params.url;

  Room.isset(url, function (err, count){ 
    if( count > 0 ){
      console.log('True');
    } else {
      console.log('False');
    }
  });

  res.render('dashboard', { title: 'Expresssss',  });
};

module.exports = { index }
