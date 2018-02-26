var mongoose = require('mongoose');
var url = global.__MONGO_URI__ || process.env.MONGO_URI;

mongoose.Promise = global.Promise;
mongoose.connect(url);
module.exports = {mongoose};
