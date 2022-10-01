'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      lat: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      lon: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      departmentId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: { model: 'departments', key: 'id' },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Nodes');
  },
};
