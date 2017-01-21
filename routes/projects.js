var express = require('express');

module.exports = function(db){
  var router = express.Router();
  router.get('/new', function(req, res, next){
    res.render('projects/new')
  });

  router.post('/new', function(req, res, next){
    var body = req.body
    var invitees = req.body.inviteEmails
    var inviteeList = invitees.split(/[,\n ]+/)
    db.sequelize.transaction(function(transaction){
      return db.Project
      .create({
        name: body.projectName,
        description: body.description,
        numMembers: body.teamSize,
        ownerId: 0
      }, {transaction})
      .then(function(project) {
          var promiseArray = []
          promiseArray.push(
            db.User.create({
              email: body.creatorEmail,
              name: body.creatorPassword,
              project,
              isAdmin: true
            }, {transaction})
            .then(function(user){
              return project.setOwner(user, {transaction})
            })
          );
          promiseArray = promiseArray.concat(
            inviteeList
            // TODO: filter for valid emails
            //.filter(validEmail)
            .map(function(email){
              return db.User.create({
                email: email,
                project,
                isAdmin: false
              }, {transaction})
            })
          )
          return Promise
            .all(promiseArray)
            .then(Promise.resolve(project));
        })
    })
    .then(function(project){
      console.log("Project created");
      res.render('projects/created', {details: body.toJSON()});
    })
  })
  return router
}
