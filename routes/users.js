var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/index', { title: 'User Dashboard' });
});

router.get('/:url', function(req, res, next) {
  switch(req.params.url) {
    case 'sign_up':
      res.render('users/sign_up', { title: 'Sign up' });
      break;
    case 'sign_in':
      res.render('users/sign_in', { title: 'Sign in' });
      break;
    default:
      res.render('users/index', { title: 'User Dashboard' });
  }
});

module.exports = router;
