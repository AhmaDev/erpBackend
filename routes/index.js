var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ API_VERSION: process.env.API_VERSION });
});

module.exports = router;
