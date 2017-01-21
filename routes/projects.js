var express = require('express');

module.exports = function(globals){
  var db = globals.db;

  var router = express.Router();
  router.get('/new', function(req, res, next){
    res.render('new')
  });

  router.post('/new', function(req, res, next){
    var body = req.body
    var invitees = body.emails
    console.log(body.emails)
    var inviteeList = invitees.split(/[,\n ]+/)

    db.sequelize.transaction(function(transaction){
      return db.Project
      .create({
        name: body.project_name,
        description: body.project_desc,
        numMembers: body.team_size,
        ownerId: 0
      }, {transaction})
      .then(function(project) {
          var promiseArray = []
          promiseArray.push(
            db.User.create({
              email: body.creator_email,
              name: body.creator_name,
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
            .then(Promise.resolve([project, promiseArray[0], promiseArray.slice(1)]));
        })
    })
    .then(function(projAndUser){
      // If created
      [project, inviter, invitees] = projAndUser
      // TODO: Send out emails to inviteeList and user(the inviter)
      // each user's token = globals.auth.jwtForUser(user)

      // Send inviter the email
      var subject = 'Project Allocation Session Created';
      var content = 'Hey there!\n\n, your project allocation session can be administered at [link]';
      Mail.sendMail(inviter.email, subject, content);
      // Send each invitee an email
      invitees.forEach(function(invitee){
        var token = globals.auth.jwtForUser(user);
        var sendLink = global.url + '/join?login=' + token;
        var subject = 'Invitation to Project Allocation Session';
        var content = 'Hey there!\n\nPlease proceed to ' + sendLink + 'in order to participate in the project allocation session.';
        Mail.sendMail(invitee.email, subject, content);
        console.log("Sent mail to: " + invite.email);
        // console.log
      })
      console.log("Project created");
      res.cookie('jwt', globals.auth.jwtForUser(inviter), {secure: true, maxAge:99999999999});
      res.json("OK");
  });

  });

  return router
}
