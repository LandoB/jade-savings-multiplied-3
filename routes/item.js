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
        user: theUser.username
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
      res.render('item', {
        title : 'Items List',
        item: thisItem
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
  res.render('item', {
    title : 'Items List',
    // action: "EDIT",
    item: {
      item: 'iGolf',
      seller: 'Apple Inc',
      price: 82.19,
      image: '',
      found: false,
      user: '',
      endDate: Date
    }
  });
});

// Handle a DELETE request from the client to /grocery
router.delete('/', function (req, res) {
console.log(req.body.item_id);
  Item.find({ _id: req.body.item_id })
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
    Item.findOne({ _id: req.body.db_id }, function (err, foundItem) {

      if (err) {
        sendError(req, res, err, "Could not find that item");
      } else {
        // Found it. Now update the values based on the form POST data.
        foundItem.item = req.body.item;
        foundItem.seller = req.body.quantity;
        foundItem.price = req.body.price;
        foundItem.image = (req.body.price * req.body.quantity);
        foundItem.found = (req.body.found) ? req.body.found : false;
        foundItem.endDate = req.body.endDate;

        // Save the updated item.
        foundItem.save(function (err, newOne) {  // this is how you save records to the db: save
          if (err) {
            sendError(req, res, err, "Could not save item with updated information");
          } else {
            res.redirect('/item/list');
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


    var myItem = new Item(theFormPostData);
    myItem.save(function (err, item) {
      if (err) {
        sendError(req, res, err, "Failed to save item");
      } else {
        res.redirect('/item/list');
      }
    });
  }
});

module.exports = router;
