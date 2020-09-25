import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class StudentBatch extends Model {}

StudentBatch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semester: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    groups: {
      type: DataTypes.JSON,
    },
  },
  {
    sequelize,
    modelName: 'StudentBatch',
  }
);

export default StudentBatch;
