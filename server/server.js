const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Review} = require('./models/review');

var app = express();

app.use(bodyParser.json());

app.post('/reviews', (req, res) => {
  console.log(req.body);
  var review = new Review({
    owner: req.body.owner,
    name: req.body.name,
    description: req.body.description
  });

  review.save().then((doc) => {
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
