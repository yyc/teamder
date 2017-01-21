'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    isComplete: DataTypes.BOOLEAN,
    owner: DataTypes.USER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Project;
};