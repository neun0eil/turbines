'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('node_tag', {
      nodeId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: { model: 'nodes', key: 'id' },
      },
      tagId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: { model: 'tags', key: 'id' },
      },
    });
    await queryInterface.addIndex('node_tag', ['nodeId', 'tagId']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('node_tag');
  }
};
