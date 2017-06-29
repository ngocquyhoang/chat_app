'use strict';

var express = require('express');
var router = express.Router();
var roomsController = require('../controllers/roomsController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:url', roomsController.index);

module.exports = router;
