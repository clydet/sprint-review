const Review = require('./../models/review');

function create(req, res) {
  var review = new Review(req.body);
  return review.save()
    .then((doc) => {
      res.send(doc);
    }, (err) => {
      res.status(400).send(err);
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
  remove
}
