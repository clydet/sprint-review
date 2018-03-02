var mongoose = require('mongoose');

var issueSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = mongoose.model('Issue', issueSchema);
