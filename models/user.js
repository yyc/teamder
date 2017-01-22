'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    projectId: DataTypes.INTEGER,
    isAdmin: DataTypes.BOOLEAN,
    isCompleted: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    proficiencies: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.Project, {foreignKey: 'projectId'})
        this.belongsToMany(models.User, {through: 'Match', as: 'Edges',
          foreignKey: 'sourceId', otherKey: 'destinationId'});
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
