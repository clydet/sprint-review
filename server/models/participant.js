var mongoose = require('mongoose');

var participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = mongoose.model('Participant', participantSchema);
