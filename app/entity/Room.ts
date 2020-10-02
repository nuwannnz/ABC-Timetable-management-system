import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Room extends Model {}

Room.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    notAvailableTimeSlot: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },

  {
    sequelize,
    modelName: 'Room',
  }
);

export default Room;
