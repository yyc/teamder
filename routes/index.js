var express = require('express');
var router = express.Router();


module.exports = function(globals){

  var projects = require('./projects')(globals);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.use('/projects', projects);

  /*router.post('/projects/:filename', function(req, res, next){
    console.log(req.body);
    res.render(req.params.filename, req.body);
})*/
  router.get('/authtest', globals.passport.authenticate('jwt', { session: false}), function(req, res, next){
    res.end("AUTH SUCCESS");
  });

  return router;
}
