const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
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
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedTime: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Review', reviewSchema);
