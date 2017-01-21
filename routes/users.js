var express = require('express');

module.exports = function(globals){
  var db = globals.db;

  var router = express.Router();
  router.get('/join', function(req, res, next){
      globals.auth.refreshCookie(res, req.user);
      req.user.getProject()
      .then(function(project){
        res.render('join', {skill: [], project, email: req.user.email})
      })
  });

  router.post('/join', function(req, res, next){
    var body = req.body
    req.user.update({
      name: req.body.joiner_name,
      description: req.body.joiner_about,
      proficiencies: JSON.Stringify(req.body.joiner_skills)
    })
    .then(function(){
      console.log("User updated");
      globals.auth.refreshCookie(res, req.user);
      res.json("OK");
    })
  });

  return router
}
