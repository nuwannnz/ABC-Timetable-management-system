/* eslint-disable import/no-cycle */
import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';
import Lecture from './Lecture';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Faculty extends Model {}

Faculty.init(
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
    modelName: 'Faculty',
  }
);

// Faculty.hasMany(Lecture);
export default Faculty;
