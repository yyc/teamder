var express = require('express');

module.exports = function(globals){
  var db = globals.db;

  var router = express.Router();
  router.get('/new', function(req, res, next){
    res.render('projects/new')
  });

  router.post('/new', function(req, res, next){
    alert("A");
    var body = req.body
    var invitees = req.body.inviteEmails
    var inviteeList = invitees.split(/[,\n ]+/)
    res.send("test");

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
              name: body.creatorName,
              projectId:project.id,
              isAdmin: true
            }, {transaction})
            .then(function(user){
              return project.setOwner(user, {transaction})
                            .then(Promise.resolve(user));
            })
          );
          promiseArray = promiseArray.concat(
            inviteeList
            // TODO: filter for valid emails
            //.filter(validEmail)
            .map(function(email){
              return db.User.create({
                email: email,
                projectId: project.id,
                isAdmin: false
              }, {transaction})
            })
          );
          return Promise
            .all(promiseArray)
            .then(Promise.resolve([project, promiseArray[0]]));
        })
    })
    .then(function(projAndUser){
      [project, user] = projAndUser
      console.log("Project created");
      res.cookie('jwt', globals.auth.jwtForUser(user), {secure: true, maxAge:99999999999});
      res.json("OK");
  });

  });

  return router
}
