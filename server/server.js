require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var reviewController = require('./controllers/review-controller');
var Review = require('./models/review');
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

app.post('/participants', (req, res) => {
  var id = req.body.reviewId;

  console.log('Request body', req.body);

  Review.findById(id).then((review) => {
    if (!review) {
      return res.status(404).send();
    }
    review.participants.push(_.omit(req.body, ['reviewId']));
    review.save();
    res.send();
  }).catch((err) => {
    console.log('Error', err);
    res.status(400).send();
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
