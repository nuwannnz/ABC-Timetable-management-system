import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';
import Room from './Room';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Building extends Model {}

Building.init(
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
    modelName: 'Building',
  }
);

Building.hasMany(Room);
export default Building;
