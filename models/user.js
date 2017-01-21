'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    isAdmin: DataTypes.BOOLEAN,
    isCompleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.Project, {foreignKey: 'projectId'})
      }
    },
    instanceMethods: {
      payload: function(){
        return {
          id: this.id,
          projectId: this.projectId
        }
      }
    }
  });
  return User;
};
