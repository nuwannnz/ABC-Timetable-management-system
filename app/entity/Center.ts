/* eslint-disable import/no-cycle */
import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';
import Lecture from './Lecture';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Center extends Model {}

Center.init(
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
    modelName: 'Center',
  }
);

// Center.hasMany(Lecture);
export default Center;
