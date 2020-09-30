import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync('group-rooms.json');

const db = low(adapter);

export interface IIndexable {
  [key: string]: any;
}
export type PreferedRoomsType = {
  groupRooms: { groupId: string; roomId: number[] }[];
};

export const defaultPreferedRoomsState: PreferedRoomsType = {
  groupRooms: [],
};

db.defaults(defaultPreferedRoomsState).write();

export const getPreferedRoomsState = (): PreferedRoomsType => db.getState();

export const savePreferedRoomsState = (newState: PreferedRoomsType) => {
  db.setState(newState);
  db.write();
};
