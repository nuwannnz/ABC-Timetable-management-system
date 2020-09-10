/* eslint-disable promise/always-return */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Room from '../../entity/Room';

export default function AddRoomForm() {
  const [roomName, setroomName] = useState('');
  const [roomCapacity, setroomCapacity] = useState('');

  const addRoomClickHandler = () => {
    if (roomName.length === 0 && roomCapacity.length === 0) {
      alert('Room Name and Room Capacity are required!');
      return;
    } else if (roomName.length === 0) {
      alert('Room Name is required!');
      if (roomCapacity.length === 0) {
        alert('Room Capacity is required!');
      }
      return;
    } else if (roomCapacity.length === 0) {
      alert('Room Capacity is required!');
      if (roomName.length === 0) {
        alert('Room Name is required!');
      }
      return;
    }

    // const roomCap = Number(roomCapacity);

    // Room.create({ name: roomName, capacity: roomCap })
    //   .then(() => {
    //     setroomName('');
    //     setroomCapacity('');
    //   })
    //   .catch((e) => alert('Fail to add room'));
  };

  return (
    <div className={styles.addBuildingWrap}>
      <h5>Add Room</h5>

      <label htmlFor="basic-url">Room Name</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          onChange={(e) => setroomName(e.target.value)}
        />
      </InputGroup>

      <label htmlFor="basic-url">Room Capacity</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          onChange={(e) => setroomCapacity(e.target.value)}
        />
      </InputGroup>
      <div>
        <Button
          className={styles.floatRightBtn}
          variant="primary"
          onClick={addRoomClickHandler}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
