var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require('../userController');
var UserModel = require('../models/user');
var auctionItems = require('../models/auctionItem');

//Sending an error
var sendError = function(req, res, err, message) {
  console.log('Render the error template back to the client.');
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

//Handle the get request for registration form
app.get("/register", function(req, res) {
  console.log('************ User hit register ***********');
  res.render("register");
});

//Handle the post request from the registration form
app.post('/register', function(req, res) {
  var newUser = new UserModel(req.body);
  console.log('*************** here is the new user', newUser)

  newUser.save(function(err, user) {
    console.log('going to the redirect');
    if (err) {
      sendError(req, res, err, 'Failed to register user');
    } else {
      res.redirect('/');
    }
  });
});

//Get to Login
app.get("/login", function(req, res) {
  console.log('********** User hit login ************');
  res.render("login");
});

//Handling a login action
app.post('/login', function(req, res) {
  console.log('Node handling login route');

  //Try to log user w/ given info
  UserController.login(req.body.username, req.body.password)
    //After the database call is complete and successful, promise returns user obj.
    .then(function (validUser) {
      console.log('back in route handling user obj.');
      console.log('validUser =', validUser);
      // res.redirect('/auction');
      res.render("auction");

    })

});

module.exports = app;
