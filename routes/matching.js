var express = require('express');
var match = require('../teamalgo/algo.js');

module.exports = function(globals){
  var db = globals.db;

  var router = express.Router();
  router.get('/matching', function(req, res, next){
    Promise.all([
      req.user.getProject({
        include: [globals.db.User]
      }),
      globals.db.UserEdge.findAll({
        include: [{
          model: globals.db.User,
          as: 'source',
          where: { projectId: req.user.projectId }
        }]
      })
    ])
    .then(function(projectEdges){
      [project, edges] = projectEdges;
      var usernames = {};
      var users = project.Users.map(function(user){
        usernames[user.id] = user.name;
        return {
          id: user.id,
          skill_list: user.proficiencies && user.proficiencies != '[]' ? JSON.parse(user.proficiencies): [Math.ceil(Math.random()*9),Math.ceil(Math.random()*9),Math.ceil(Math.random()*9)],
          name: user.name
        }
      })
      var edges = edges.map(function(edge){
        return {
          source: edge.sourceId,
          target: edge.targetId
        }
      })
      var results = match(users, edges, project.numMembers)
      var resultsParsed = results.map(function(ary){
        return ary.map(function(val){
          return usernames[val];
        });
      });
      res.render("test", {teams:resultsParsed, usernames});
    });
  });


  return router
}
