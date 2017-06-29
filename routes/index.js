'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:url', function(req, res, next) {
  var param_id = req.params.url;
  res.render('dashboard', { title: 'Express', id: param_id });
});

module.exports = router;
