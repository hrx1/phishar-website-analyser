var express = require('express');
var router = express.Router();

router.get('', function(req, res, next) {
  console.log("U ruteru sam")
  res.setHeader('Content-Type', 'application/json')
  res.json({"foo": "bar"});
});

module.exports = router;
