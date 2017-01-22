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
      globals.db.userEdge.findAll({
        include: [{
          model: globals.db.User,
          as: 'User',
          where: { projectId: req.user.projectId }
        }]
      })
    ])
    .then(function(projectEdges){
      [project, edges] = projectEdges;
      var users = project.Users.map(function(user){
        return {
          id: user.id,
          skill_list: user.proficiencies ? JSON.parse(user.proficiencies), []
        }
      })
      var edges = edges.map(function(edge){
        return {
          source: edge.sourceId,
          target: edge.targetId
        }
      })
      var results = match(users, edges, project.numMembers)
    });
  });


  return router
}
