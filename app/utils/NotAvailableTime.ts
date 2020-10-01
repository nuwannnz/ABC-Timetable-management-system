/* eslint-disable prettier/prettier */
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('not-available-time.json');

const db = low(adapter);

export interface IIndexable {
  [key: string]: any;
}
export type NotAvailableTimeType = {
  id: string;
  sessions: {
    id:string,
    sessionId: string;
    timeslotId:string;

  }[];
  lecturers:{
    id:string,
    lectureId: string;
    timeslotId:string;

  }[];
  groups: {
    id:string,
    groupId: string;
    timeslotId:string;

  }[];
  subGroups: {
    id:string,
    subGroupId: string;
    timeslotId:string;

  }[];
}

export const deafultNotAvailbleTimeState: NotAvailableTimeType = {
  id: "",
  sessions: [],
  lecturers: [],
  groups: [],
  subGroups: [],


};

db.defaults(deafultNotAvailbleTimeState).write();

export const getNotAvailbleTimeState = (): NotAvailableTimeType => db.getState();

export const saveNotAvailbleTimeState = (newState: NotAvailableTimeType) => {
  db.setState(newState);
  db.write();
};
