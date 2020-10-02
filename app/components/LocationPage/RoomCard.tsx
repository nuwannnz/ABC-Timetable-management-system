/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { Badge, Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Room from '../../entity/Room';
import { LocationPageContext } from '../../containers/LocationPage';
import { getWorkingDaysState } from '../../utils/workingDaysDB';
import { TimeslotType } from './AddRoomForm';

type RoomCardType = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardType) {
  const context = useContext(LocationPageContext);

  const getTimeslotList = () => {
    const timeslotList = getWorkingDaysState();
    const timeslotBadges: any[] = [];
    room.get().notAvailableTimeSlot.forEach((tId: any) => {
      const timeslot = timeslotList.timeSlots.find(
        (t) => t.id === tId
      ) as TimeslotType;
      timeslotBadges.push(
        <Badge variant="success">{`${timeslot.startTime.hour}:${
          timeslot.startTime.minute
        } ${timeslot.AM ? 'AM' : 'PM'} -
      ${timeslot.endTime.hour}:${timeslot.endTime.minute} ${
          timeslot.AM ? 'AM' : 'PM'
        }`}</Badge>
      );
    });
    return timeslotBadges.map((b) => b);
  };

  return (
    <div className={styles.rCardWrap}>
      <div className="d-flex">
        <p>Room Name: </p>
        <p className={styles.bInputValue}>{(room as any).name}</p>
      </div>
      <div className="d-flex">
        <p>Room Capacity: </p>
        <p className={styles.bInputValue}>{(room as any).capacity}</p>
      </div>
      {room.get().notAvailableTimeSlot && (
        <div className="d-flex">
          <p>Not Availables Times: </p>
          <p className={styles.bInputValue}>{getTimeslotList()}</p>
        </div>
      )}

      <div className={styles.rCardBtn}>
        <Button
          className="mr-2"
          variant="secondary"
          size="sm"
          onClick={() => context.onEditRoomClickHandler(room)}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => context.onDeleteRoomHandler((room as any).id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
