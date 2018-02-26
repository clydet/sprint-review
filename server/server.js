require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var reviewController = require('./controllers/review-controller');
var app = express();

app.use(bodyParser.json());

app.post('/reviews', (req, res) => {
  var promise = reviewController.create(req.body)
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
});

app.post('/participants/', (req, res) => {
  participantController.create(req.body)
  .then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/health', (req, res) => {
  res.send({
    message: 'all clear'
  });
});

var server = app.listen(3001, () => {
  console.log('Listening on port 3001');
})

module.exports = {
  app,
  server,
  mongoose
}
