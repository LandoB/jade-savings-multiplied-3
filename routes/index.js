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

module.exports = router;
