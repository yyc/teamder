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
    var body = req.body;
    req.user.update({
      name: req.body.joiner_name,
      description: req.body.joiner_about,
      proficiencies: JSON.stringify(req.body.joiner_skills)
    })
    .then(function(){
      console.log("User updated");
      globals.auth.refreshCookie(res , req.user);
      res.json("OK");
  }).error(function(msg) {
      console.log(msg)
  })
  });

  router.get('/admin', function(req, res, next){
    if(req.user.isAdmin){
      req.user.getProject()
      .then(function(project){
        res.render('admin', {project})
      });
    } else{
      res.status(401);
      res.render("error", {error: "Unauthorized"});
    }
  });

  router.get('/match', function(req, res, next){
    if(req.user.isAdmin){
      console.log("Overauthorized");
      res.redirect('/project/admin');
    } else{
      req.user.getProject()
      .then(function(project){
        Promise.all([
          project.getUsers({
            where: {
              name: { $ne: null },
              isAdmin: { $eq: false }
            }
          }),
          req.user.getEdges()
        ])
         .then(function(usersEdges){
           [users, edges] = usersEdges
           for(var i = 0; i < users.length; i++){
             for(var j = 0; j < edges.length; j++){
               if(users[i].id = edges[j].id){
                 if(edges[j].weight != 0){
                   console.log(`Checked ${users[i].id}`);
                   users[i].checkedValue = "checked";
                 }
                 break;
               }
             }
           }
          res.render('match', {project, people: users});
        })
      })
    }
  });

  router.post('/match', function(req, res, next){
    var matches = req.body.matched_people_index.map(parseInt);
    globals.db.User.findAll({where: {id: matches}})
    .then(function(users){
      return globals.db.UserEdges.destroy({where: {sourceId: req.user.id}})
      .then(function(count){
        return globals.db.UserEdges.bulkCreate(
          users.map(function(user){
            return {
              sourceId: req.user.id,
              targetId: user.id
            }
          })
        )
      })
    })
    .then(function(){
      res.json("Your preferences have been recorded.");
      return globals.db.User.count(
        {where: {
          projectId: req.user.projectId,
          name: {
            $eq: null
          }
        }
      })
    })
    .then(function(count){ // If all users were already visible
      req.user.setDataValue('isCompleted',true);
      return req.user.save();
    })
    .then(function(user){
      console.log(`User #${user.id} ${user.name} marked as completed`);
    })
  });

  return router
}
