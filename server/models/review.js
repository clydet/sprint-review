const mongoose = require('mongoose');
var schemas = require('./schemas');

module.exports = mongoose.model('Review', schemas.reviewSchema);
