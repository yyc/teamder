var express = require('express');
var router = express.Router();

var projects = require('projects');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('projects', projects)


module.exports = router;
