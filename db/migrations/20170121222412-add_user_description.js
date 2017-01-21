'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
      'Users',
      'description',
      Sequelize.STRING
    ),
    queryInterface.addColumn(
      'Users',
      'proficiencies',
      {
        type: Sequelize.STRING,
      }
    ),
    queryInterface.addColumn(
      'Projects',
      'skills',
      {
        type: Sequelize.STRING,
      }
    )]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropColumn(
        'Users',
        'description'
      ),
      queryInterface.dropColumn(
        'Users',
        'proficiencies'
      ),
      queryInterface.dropColumn(
        'Users',
        'skills'
      )
    ])
  }
};
