var {Review} = require('./../models/review');

var create = (body) => {
  var review = new Review({
    owner: body.owner,
    name: body.name,
    description: body.description
  });

  return review.save();
}

module.exports = {
  create
}
