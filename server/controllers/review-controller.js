const Review = require('./../models/review');
const _ = require('lodash');

const omit = ['participants', 'completed', 'completedTime'];

function create(req, res) {
  var review = new Review(req.body);
  return review.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
    });
}

function update(req, res) {
  let id = req.params.id;
  let keys = _.keys(_.omit(Review.schema.obj, omit));
  let changeSet = _.pick(req.body, keys);

  Review.findByIdAndUpdate(id, changeSet, {new: true})
    .then((review) => {
      if (review === null) {
        return res.status(404).send();
      }
      res.status(200).send(review);
    });
}

function remove(req, res) {
  let id = req.params.id;
  Review.findById(id)
    .then((review) => {
      review.remove();
    })
    .then(() => res.status(204).send())
    .catch((err) => res.status(404).send(err));
}

module.exports = {
  create,
  update,
  remove
}
