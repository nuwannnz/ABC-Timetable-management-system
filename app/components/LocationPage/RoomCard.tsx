/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './LocationPage.css';

export default function RoomCard() {
  return (
    <div className={styles.rCardWrap}>
      <div className="d-flex">
        <p>Room Name: </p>
        <p className={styles.bInputValue}>A501</p>
      </div>
      <div className="d-flex">
        <p>Room Capacity: </p>
        <p className={styles.bInputValue}>100</p>
      </div>
      <div className={styles.rCardBtn}>
        <Button className="mr-2" variant="secondary" size="sm">
          Edit
        </Button>
        <Button variant="secondary" size="sm">
          Delete
        </Button>
      </div>
    </div>
  );
}
