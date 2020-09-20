import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Session',
  }
);

export default Session;
