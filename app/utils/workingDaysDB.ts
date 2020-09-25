import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('working-days.json');

const db = low(adapter);

export interface IIndexable {
  [key: string]: any;
}
export type WorkingDaysType = {
  numWorkingDays: number;
  workingDays: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  workingTimePerDay: {
    hours: number;
    minutes: number;
  };
  timeSlots: {
    id: string;
    startTime: {
      hour: number;
      minute: number;
    };
    endTime: {
      hour: number;
      minute: number;
    };
    AM: boolean;
  }[];
};

export const defaultWorkingDaysState: WorkingDaysType = {
  numWorkingDays: 0,
  workingDays: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
  workingTimePerDay: {
    hours: 0,
    minutes: 0,
  },
  timeSlots: [],
};

db.defaults(defaultWorkingDaysState).write();

export const getWorkingDaysState = (): WorkingDaysType => db.getState();

export const saveWorkingDaysState = (newState: WorkingDaysType) => {
  db.setState(newState);
  db.write();
};
