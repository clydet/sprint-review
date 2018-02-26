var mongoose = require('mongoose');
var url = process.env.MONGO_URI || global.__MONGO_URI__;

mongoose.Promise = global.Promise;
mongoose.connect(url);
module.exports = {mongoose};
