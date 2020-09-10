import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';
import Lecture from './Lecture';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Department extends Model {}

Department.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Department',
  }
);

Department.hasMany(Lecture);
export default Department;
