'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    isComplete: DataTypes.BOOLEAN,
    ownerId: DataTypes.INTEGER,
    numMembers: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    skills: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Project.belongsTo(models.User, {as: "owner"})
      }
    }
  });
  return Project;
};
