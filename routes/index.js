var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Savings Multiplied | version 3' });
});

/* GET auction page. */
 router.get('/auction', function(req, res, next) {
   res.render('auction', { title: 'Auction | Savings Multiplied' });
 });

/* GET singin page. */
 router.get('/signin', function(req, res, next) {
   res.render('signin', { title: 'Sign In | Savings Multiplied' });
 });

 /* GET singin page. */
 router.get('/signup', function(req, res, next) {
   res.render('signup', { title: 'Sign Up | Savings Multiplied' });
 });

module.exports = router;
