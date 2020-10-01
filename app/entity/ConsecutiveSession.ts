/* eslint-disable prettier/prettier */
import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class ConsecutiveSession extends Model {}

ConsecutiveSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    conSessions: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: 'ConsecutiveSession'
  }
);

export default ConsecutiveSession;
