var express = require('express');
var router = express.Router();


module.exports = function(globals){

  var projects = require('./projects')(globals);
  var users = require('./users')(globals);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });

  router.use('/projects', projects);
  router.use('/projects', globals.passport.authenticate('jwt',
   { session: false}), users);

  /*router.post('/projects/:filename', function(req, res, next){
    console.log(req.body);
    res.render(req.params.filename, req.body);
})*/
  router.get('/authtest', globals.passport.authenticate('jwt', { session: false}), function(req, res, next){
    res.end("AUTH SUCCESS");
  });
  router.get('/usercheat/:id', function(req, res, next){
    globals.db.User.findOne({id: req.params.id})
      .then(function(user){
        globals.auth.refreshCookie(res, user);
        res.end(`Successfully logged in as ${user.email}!`);
      })
  })

  return router;
}
