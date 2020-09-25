import { Sequelize, DataTypes, Model } from 'sequelize';
import { getConnection } from '../utils/db';

const sequelize = getConnection();

// eslint-disable-next-line import/prefer-default-export
class Subject extends Model {
  id: any;
}

Subject.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lectureHours: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    tutorialHours: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    labHours: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    evaluationHours: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Subject',
  }
);

console.log(Subject === sequelize.models.Subject);

export default Subject;
