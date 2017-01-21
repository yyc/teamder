var express = require('express');

module.exports = function(globals){
  var db = globals.db;

  var router = express.Router();
  router.get('/new', function(req, res, next){
    res.render('new')
  });

  router.post('/new', function(req, res, next){
    var body = req.body
    var inviteeList = body.email_list

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
                            .then((proj) => Promise.resolve(user));
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
            .then((results) => Promise.resolve({
              project,
              inviter: results[0],
              invitees: results.slice(1)}));
        })
    })
    .then(function(projAndUser){
      // If created
      var project = projAndUser.project;
      var inviter = projAndUser.inviter;
      var inviteeList = projAndUser.invitees;
      // TODO: Send out emails to inviteeList and user(the inviter)
      // each user's token = globals.auth.jwtForUser(user)
      // Send inviter the email
      var subject = 'Project Allocation Session Created';
      var content = 'Hey there!\n\n, your project allocation session can be administered at [link]';
      globals.Mail.sendMail(inviter.email, subject, content);
      // Send each invitee an email
      inviteeList.forEach(function(invitee){
        console.log(invitee)
        var token = globals.auth.jwtForUser(invitee);
        var sendLink = global.url + '/join?login=' + token;
        var subject = 'Invitation to Project Allocation Session';
        var content = 'Hey there!\n\nPlease proceed to ' + sendLink + 'in order to participate in the project allocation session.';
        globals.Mail.sendMail(invitee.email, subject, content);
        console.log("Sent mail to: " + invitee.email);
        // console.log
      })
      console.log("Project created");
      globals.auth.refreshCookie(res, inviter);
      res.json("OK");
  });

  });

  return router
}
