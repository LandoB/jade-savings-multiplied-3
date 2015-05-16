var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var itemList = [];

// Include the model for a Grocery that we set up in Mongoose
var Items = require('../models/item');

// Send the error message back to the client
var sendError = function (req, res, err, message) {
  res.render("error", {
    error: {
      status: 500,
      stack: JSON.stringify(err.errors)
    },
    message: message
  });
};

// Send the grocery list back to the client
var sendItemList = function (req, res, next) {

  var theUser = UserController.getCurrentUser();
  console.log("theUser: ",theUser);

  Item.find({user: theUser._id}, function (err, items) {
    console.log("items",items);
    // Swap out the user._id for the user.username

    // For loop over the groceries array
    for (var i = 0; i < items.length; i++) {
      items[i].user = theUser.username; // this is how you change the user_id for the username
    };


    console.log('items', items);

    if (err) {
      console.log(err);
      sendError(req, res, err, "Could not get shopping list");
    } else {
      res.render("itemList", {
        title: "List of Items",
        message: "My Items List",
        groceries: groceries,
        user: theUser.username,
        budget: theUser.budget
      });
    }
  });
};

// Handle a GET request from the client to /grocery/list
router.get('/list', function (req,res,next) {
  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  sendGroceryList(req, res, next);
});

// Handle a GET request from the client to /grocery/:id
router.get('/:id', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  Grocery.find({ _id: req.params.id }, function (err, item) {
    console.log("item: ",item);
    var thisItem = item[0];

    // Was there an error when retrieving?
    if (err) {
      sendError(req, res, err, "Could not find an item with that id");

    // Find was successful
    } else {
      res.render('grocery', {
        title : 'Grocery Shopping List',
        grocery: thisItem
      });
    }
  });
});

// Handle a GET request from the client to /grocery
router.get('/', function (req, res) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  // Send the grocery form back to the client
  // ***********************************************
  // This is the code changed for the new schema   *
  // ***********************************************
  res.render('grocery', {
    title : 'Grocery Shopping List',
    // action: "EDIT",
    grocery: {
      item: '',
      quantity: 1,
      price: 0,
      cost: 0,
      found: false
    }
  });
});

// Handle a DELETE request from the client to /grocery
router.delete('/', function (req, res) {
console.log(req.body.grocery_id);
  Grocery.find({ _id: req.body.grocery_id })
      .remove(function (err) { // this is how you delete records from the db: .remove
    // Was there an error when removing?
    if (err) {
      sendError(req, res, err, "Could not delete the item");

    // Delete was successful
    } else {
      res.send("SUCCESS");
    }
  });
});

// Handle a POST request from the client to /grocery
router.post('/', function (req, res, next) {

  // User is editing an existing item
  if (req.body.db_id !== "") {

    // Find it
    Grocery.findOne({ _id: req.body.db_id }, function (err, foundGrocery) {

      if (err) {
        sendError(req, res, err, "Could not find that task");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundGrocery.item = req.body.item;
        foundGrocery.quantity = req.body.quantity;
        foundGrocery.price = req.body.price;
        foundGrocery.cost = (req.body.price * req.body.quantity);
        foundGrocery.found = (req.body.found) ? req.body.found : false;

        // Save the updated item.
        foundGrocery.save(function (err, newOne) {  // this is how you save records to the db: save
          if (err) {
            sendError(req, res, err, "Could not save item with updated information");
          } else {
            res.redirect('/grocery/list');
            // res.redirect('/grocery/list?action=' + "EDIT");
          }
        });
      }
    });

  // User created a new item
  } else {

    // Who is the user?
    var theUser = UserController.getCurrentUser();

    // What did the user enter in the form?
    var theFormPostData = req.body
    theFormPostData.user = theUser._id;

    console.log('theFormPostData',theFormPostData);


    var myGrocery = new Grocery(theFormPostData);
    myGrocery.cost = (myGrocery.price * myGrocery.quantity).toFixed(2);
    myGrocery.save(function (err, grocery) {
      if (err) {
        sendError(req, res, err, "Failed to save item");
      } else {
        res.redirect('/grocery/list');
      }
    });
  }
});

module.exports = router;
