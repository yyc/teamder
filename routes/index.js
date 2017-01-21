var express = require('express');
var router = express.Router();


module.exports = function(globals){

  var projects = require('./projects')(globals);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  router.use(projects)

  router.get('/projects/:filename', function(req, res, next){
    res.render(req.params.filename, {});
  })
  /*router.post('/projects/:filename', function(req, res, next){
    console.log(req.body);
    res.render(req.params.filename, req.body);
})*/

  return router;
}
