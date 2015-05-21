// auction item schema

var mongoose = require('mongoose');

var auctionSchema = mongoose.Schema({
	title: {type: String, required: true, default: ''},
  type: {type: String, required: true, default: ''},
  size: {type: String, required: true, default: ''},
  season: {type: String, required: true, default: ''},
  condition: {type: String, required: true, default: ''},
  image: {type: String, required: true, default: ''},
  brand: {type: String, required: true, default: ''},
  user: {type: String, required: true}
});

var auctionModel = mongoose.model('auctionItem', auctionSchema);

module.exports = auctionModel;


