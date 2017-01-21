var express = require('express');
var router = express.Router();


module.exports = function(db){

  var projects = require('./projects')(db);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  router.use('/', projects)

  router.get('/viewtest/:filename', function(req, res, next){
    res.render(req.params.filename, {});
  })
  router.post('/viewtest/:filename', function(req, res, next){
    res.render(req.params.filename, req.params.body);
  })

  return router;
}
