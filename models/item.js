var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
    item: {type: String, required: true, default: 'iGolf'},
    seller: {type: String, required: true, default: 'Apple Inc' },
    price: {type: Number, required: true, default: 82.19 },
    image: {type: String, required: true, default: 'http://www.macwallpapers.eu/images/wallpapers/Mac%20Apple%20Practical%20Golf%20Course%20Sport%20Edition-158348.jpeg'},
    found: {type: Boolean, required: true, default: false },
    user: {type: String, required: true},
    endDate: {type: Date, required: false, default: '2015-12-31T12:34:56Z'}
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;


