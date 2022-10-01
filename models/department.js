import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Department extends Model {
    static associate(models) {
      Department.hasMany(models.Node);
    }
  }
  Department.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Department',
    }
  );
  return Department;
};
