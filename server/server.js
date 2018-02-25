const express = require('express');

var app = express();

app.get('/health', (req, res) => {
  res.send({
    message: 'all clear'
  });
});

app.listen(3000);
module.exports.app = app;
