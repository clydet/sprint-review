var mongoose = require('mongoose');
var url = global.__MONGO_URI__ || 'mongodb://localhost:27017/SprintReview';

mongoose.Promise = global.Promise;
mongoose.connect(url);
module.exports = {mongoose};
