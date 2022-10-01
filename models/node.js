import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Node extends Model {
    static associate(models) {
      Node.belongsTo(models.Department);
      Node.belongsToMany(models.Tag, { through: 'node_tag' });
    }
  }
  Node.init(
    {
      lat: DataTypes.FLOAT,
      lon: DataTypes.FLOAT,
      departmentId: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: 'Node',
    }
  );
  return Node;
};
