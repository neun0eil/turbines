import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      Tag.belongsToMany(models.Node, { through: 'node_tag' });
    }
  }
  Tag.init(
    {
      name: DataTypes.STRING,
      value: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Tag',
    }
  );
  return Tag;
};
