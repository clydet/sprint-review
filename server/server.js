require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

require('./db/mongoose');
var reviewController = require('./controllers/review-controller');
var participantController = require('./controllers/participant-controller');
var issueController = require('./controllers/issue-controller');
var voteController = require('./controllers/vote-controller');
var app = express();

app.use(bodyParser.json());

app.post('/reviews', reviewController.create);
app.delete('/reviews/:id', reviewController.remove);
app.put('/reviews/:id', reviewController.update);

app.post('/participants', participantController.create);
app.delete('/participants/:id', participantController.remove);
app.put('/participants/:id', participantController.update);

app.post('/reviews/:reviewId/issues', issueController.create);
app.delete('/issues/:id', issueController.remove);
app.put('/issues/:id', issueController.update);

app.post('/issues/:issueId/users/:userId', voteController.create);
app.delete('/votes/:voteId', voteController.remove);

app.get('/health', (req, res) => {
  res.send({
    message: 'all clear'
  });
});

var server = app.listen(3002, () => {
  console.log('Listening on port 3002');
})

module.exports = {
  app,
  server
}
