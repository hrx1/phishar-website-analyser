var express = require('express');
var router = express.Router();

var webinfoService = require('../services/webinfo.service');

router.get('', async function(req, res, next) {
  console.log("U ruteru sam")

  result = await webinfoService.fetchWebsiteInfo(req.query.url)

  res.setHeader('Content-Type', 'application/json')
  res.json(result);
});

module.exports = router;
