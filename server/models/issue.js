const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  votes: [{
    type: Schema.Types.ObjectId,
    ref: 'Vote'
  }]
});

issueSchema.virtual('voteCount').get(function() {
  return this.votes.length;
});

module.exports = mongoose.model('Issue', issueSchema);
