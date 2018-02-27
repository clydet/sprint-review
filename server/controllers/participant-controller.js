const Review = require('./../models/review');
const _ = require('lodash');

function create(req, res) {
  var id = req.body.reviewId;

  Review.findById(id).then((review) => {
    if (!review) {
      return res.status(404).send();
    }
    review.participants.push(_.omit(req.body, ['reviewId']));
    review.save().then((saved) => {
      res.send(saved);
    });
  });
}

module.exports = {
  create
}
