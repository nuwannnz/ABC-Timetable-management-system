/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable promise/always-return */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState, useEffect, useContext } from 'react';
import { InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import styles from './LocationPage.css';
import Room from '../../entity/Room';
import { LocationPageContext } from '../../containers/LocationPage';
import ToastMsg from './ToastMsg';

type EditRoomFormType = {
  room: Room;
  onRoomUpdate: () => void;
};

export default function EditRoomForm({ room, onRoomUpdate }: EditRoomFormType) {
  const [roomName, setroomName] = useState((room as any).name);
  const [roomCapacity, setroomCapacity] = useState((room as any).capacity);

  const [validRoomName, setvalidRoomName] = useState(false);
  const [validRoomCapacity, setvalidRoomCapacity] = useState(false);
  const [mainValidation, setmainValidation] = useState(false);
  const [validationCapacity, setvalidationCapacity] = useState(false);

  const context = useContext(LocationPageContext);

  const validate = () => {
    if (roomName.length === 0 && roomCapacity.length === 0) {
      setmainValidation(true);
      setvalidRoomName(false);
      setvalidRoomCapacity(false);
      setvalidationCapacity(false);
      return false;
    } else if (roomName.length === 0) {
      setvalidRoomName(true);
      setvalidRoomCapacity(false);
      setmainValidation(false);
      setvalidationCapacity(false);
      if (isNaN(Number(roomCapacity))) {
        setvalidationCapacity(true);
      }
      return false;
    } else if (roomCapacity.length === 0) {
      setvalidRoomCapacity(true);
      setvalidRoomName(false);
      setmainValidation(false);
      return false;
    } else if (isNaN(Number(roomCapacity))) {
      setvalidationCapacity(true);
      setvalidRoomCapacity(false);
      setvalidRoomName(false);
      return false;
    } else {
      setvalidRoomName(false);
      setvalidRoomCapacity(false);
      setmainValidation(false);
      setvalidationCapacity(false);
      return true;
    }
  };

  useEffect(() => {
    setvalidRoomName(false);
    setvalidRoomCapacity(false);
    setmainValidation(false);
    setvalidationCapacity(false);
  }, [roomName, roomCapacity]);

  const updateClickHandler = () => {
    if (!validate()) {
      return;
    }
    const roomCap = Number(roomCapacity);
    Room.update(
      { name: roomName, capacity: roomCap },
      { where: { id: (room as any).id } }
    )
      .then(() => {
        setroomName('');
        setroomCapacity('');
        onRoomUpdate();
      })
      .catch((e) => console.log('Fail to update!'));
  };

  return (
    <div className={styles.addBuildingWrap}>
      <h5>Edit Room</h5>

      <label htmlFor="basic-url">Room Name</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          value={roomName}
          onChange={(e) => setroomName(e.target.value)}
          onInput={(e: any) => setroomName(e.target.value)}
        />
      </InputGroup>
      {validRoomName ? (
        <Alert variant="danger">Room Name is required!</Alert>
      ) : null}

      <label htmlFor="basic-url">Room Capacity</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          value={roomCapacity}
          onChange={(e) => setroomCapacity(e.target.value)}
          onInput={(e: any) => setroomCapacity(e.target.value)}
        />
      </InputGroup>
      {validRoomCapacity ? (
        <Alert variant="danger">Room Capacity is required!</Alert>
      ) : null}

      {validationCapacity ? (
        <Alert variant="danger">
          Room Capacity should
          <div> a number!</div>
        </Alert>
      ) : null}

      {mainValidation ? (
        <Alert variant="danger">
          <div>Room Name &#38; Room</div>
          <div>Capacity are required!</div>
        </Alert>
      ) : null}

      <div>
        <Button
          className={styles.mleft}
          variant="primary"
          onClick={updateClickHandler}
        >
          Update
        </Button>
        <Button
          className={styles.floatRightBtn}
          variant="secondary"
          onClick={() => context.onEditFormCancelHandler()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
