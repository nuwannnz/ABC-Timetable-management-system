/* eslint-disable prettier/prettier */
import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class ParallelSession extends Model {}

ParallelSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parSessions: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: 'ParallelSession'
  }
);

export default ParallelSession;
