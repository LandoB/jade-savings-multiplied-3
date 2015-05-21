var express = require('express');
var router = express.Router();
var UserModel = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Savings Multiplied 3' });
});

module.exports = router;
