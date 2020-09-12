/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Room from '../../entity/Room';
import { LocationPageContext } from '../../containers/LocationPage';

type RoomCardType = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardType) {
  const context = useContext(LocationPageContext);
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
