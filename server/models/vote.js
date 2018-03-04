const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  participant: {
    type: Schema.Types.ObjectId,
    ref: 'Participant'
  },
  issue: {
    type: Schema.Types.ObjectId,
    ref: 'Issue'
  }
});

module.exports = mongoose.model('Vote', voteSchema);
