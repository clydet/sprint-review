var {Schema} = require('mongoose');

var participantSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var reviewSchema = new Schema({
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
  participants: [participantSchema],
  completed: {
    type: Boolean,
    default: false
  },
  completedTime: {
    type: Number,
    default: null
  }
});

module.exports = {
  reviewSchema
}
