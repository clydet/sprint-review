const mongoose = require('mongoose');

var Review = mongoose.model('Review', {
  owner: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedTime: {
    type: Number,
    default: null
  }
});

module.exports = {Review};
