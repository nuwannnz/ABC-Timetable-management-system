import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Lecture extends Model {}

Lecture.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    fName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Lecture',
  }
);

export default Lecture;
