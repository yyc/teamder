'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    project: DataTypes.INTEGER,
    isAdmin: DataTypes.BOOLEAN,
    isCompleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.Project)
      }
    }
  });
  return User;
};
