const Review = require('./../models/review');
const Issue = require('./../models/issue');
const _ = require('lodash');

function create(req, res) {
  let id = req.body.reviewId;

  Review.findById(id).then((review) => {
    if (!review) {
      return res.status(404).send();
    }
    let issue = new Issue(_.omit(req.body, ['reviewId']));
    review.issues.push(issue);
    review.save().then((saved) => {
      res.send(saved);
    });
  });
};

function remove(req, res) {
  let id = req.params.id;

  Issue.findById(id).then((issue) => {
    if (!issue) {
      return res.status(404).send();
    }
    issue.remove()
      .then(() => res.status(204).send());
  });
};

function update(req, res) {
  let id = req.params.id;
  let keys = _.keys(Issue.schema.obj);
  let changeSet = _.pick(req.body, keys);

  Issue.findByIdAndUpdate(id, changeSet, {new: true})
    .then((issue) => {
      if (issue === null) {
        return res.status(404).send();
      }
      res.status(200).send(issue);
    });
};

module.exports = {
  create,
  update,
  remove
}
