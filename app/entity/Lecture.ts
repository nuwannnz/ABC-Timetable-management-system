/* eslint-disable import/no-cycle */
import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';
import Building from './Building';
import Center from './Center';
import Department from './Department';
import Faculty from './Faculty';

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

// Lecture.belongsTo(Faculty);
// Lecture.belongsTo(Department);
// Lecture.belongsTo(Center);
// Lecture.belongsTo(Building);
export default Lecture;
