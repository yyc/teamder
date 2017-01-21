var express = require('express');
var router = express.Router();

module.exports = function(db){
  router.get('new', function(req, res, next){
    res.render('projects/new')
  });
  router.post('new', function(req, res, next){
    var body = req.params.body
    db.transaction(function(transaction){
      db.Project
      .create({
        name: body.projectName,
        description: body.description,
        numMembers: body.teamSize,
        owner: 0
      })
      .then(function(project) {
          var promiseArray = []
          promiseArray.push(
            db.User.create({
              email: body.creatorEmail,
              name: body.creatorPassword,
              project,
              isAdmin: true
            })
            .then(function(user){
              return project.setOwner(user)
            })
          );

        })
    })
    res.render('projects/created', {details: body.toJSON()})
  })
  return router
}
