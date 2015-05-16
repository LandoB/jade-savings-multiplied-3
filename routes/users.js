var Q = require("q");
var express = require('express');
var app = express.Router();
var UserController = require("../userController");
var UserModel = require("../models/user");
var Item = require("../models/item");

// Send the error message back to the client
var sendError = function (req, res, err, message) {
  console.log('Render the error template back to the client.');
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

// Retrieve all groceries for the current user
var getUserItems = function (userId) {
  var deferred = Q.defer();

  console.log('Another promise to let the calling function know when the database lookup is complete');

  Grocery.find({user: userId}, function (err, items) {
    if (!err) {
      console.log('Items found = ' + items.length);
      console.log('No errors when looking up items. Resolve the promise (even if none were found).');
      deferred.resolve(items);
    } else {
      console.log('There was an error looking up items. Reject the promise.');
      deferred.reject(err);
    }
  })

  return deferred.promise;
};


// Handle the request for the registration form
app.get("/signup", function (req, res) {
  res.render("signup");
});


// Handle the registration form post
app.post("/signup", function (req, res) {
  var newUser = new UserModel(req.body);

  newUser.save(function (err, user) {
    if (err) {
      sendError(req, res, err, "Failed to register user");
    } else {
      res.redirect("/user/profile");
    }
  });
});



// Handle the login action
app.post("/signin", function (req, res) {

  console.log('Hi, this is Node handling the /user/login route');

  // Attempt to log the user is with provided credentials
  UserController.singin(req.body.username, req.body.password)

    // After the database call is complete and successful,
    // the promise returns the user object
    .then(function (validUser) {

      console.log('Ok, now we are back in the route handling code and have found a user');
      console.log('validUser',validUser);
      console.log('Find any tasks that are assigned to the user');

      // Now find the items that belong to the user
      getUserItems(validUser._id)
        .then(function (items) {
          // Render the items list
          res.redirect("/user/profile");
        })
        .fail(function (err) {
          sendError(req, res, {errors: err.message}, "Failed")
        });
    })

    // After the database call is complete but failed
    .fail(function (err) {
      console.log('Failed looking up the user');
      sendError(req, res, {errors: err.message}, "Failed")
    })
});

app.get("/profile", function (req, res) {
  var user = UserController.getCurrentUser();

  if (user !== null) {
    getUserItems(user._id).then(function (items) {
      res.render("userProfile", {
        username: user.username,
        items: items,
      });
    });
  } else {
    res.redirect("/");
  }

});

app.get("/logout", function (req, res) {
  UserController.logout();
  res.redirect("/");

});

module.exports = app;



// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
