var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/savingsmultiplied3');
// mongoose.connect(process.env.DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('* * * * * * * * * * YAY, WE HAVE CONNECTED * * * * * * * * * *');
});
