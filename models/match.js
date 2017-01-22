'use strict';
module.exports = function(sequelize, DataTypes) {
  var Match = sequelize.define('UserEdges', {
    sourceId: DataTypes.INTEGER,
    targetId: DataTypes.INTEGER,
    value: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        this.belongsTo(models.User, {as: "source"});
        this.belongsTo(models.User, {as: "target"});
      }
    }
  });
  return Match;
};
