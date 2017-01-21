var express = require('express');
var router = express.Router();
var Handlebars = require('handlebars');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('new', function(req, res, next){
  res.send(handlebars.compile())
});

module.exports = router;
