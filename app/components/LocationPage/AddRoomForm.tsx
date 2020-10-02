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
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
  Form,
  Badge,
} from 'react-bootstrap';
import styles from './LocationPage.css';
import Room from '../../entity/Room';
import { LocationPageContext } from '../../containers/LocationPage';
import ToastMsg from './ToastMsg';
import {
  defaultWorkingDaysState,
  getWorkingDaysState,
  WorkingDaysType,
} from '../../utils/workingDaysDB';

type ChipPropType = {
  id: string;
  text: string;
  removeClickHandler: (id: string) => void;
};
const Chip = ({ id, removeClickHandler, text }: ChipPropType) => (
  <Button variant="info" size="sm" className="m-2">
    {text}
    <Badge
      variant="light"
      className="ml-2"
      onClick={() => removeClickHandler(id)}
    >
      X
    </Badge>
  </Button>
);

export type TimeslotType = {
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
};

export default function AddRoomForm() {
  const [roomName, setroomName] = useState('');
  const [roomCapacity, setroomCapacity] = useState('');

  const [validRoomName, setvalidRoomName] = useState(false);
  const [validRoomCapacity, setvalidRoomCapacity] = useState(false);
  const [mainValidation, setmainValidation] = useState(false);
  const [validationCapacity, setvalidationCapacity] = useState(false);
  const [showToast, setshowToast] = useState(false);
  const [displayTimeslotSelect, setdisplayTimeslotSelect] = useState(false);
  const [timeslotList, settimeslotList] = useState<WorkingDaysType>(
    defaultWorkingDaysState
  );
  const [selectedTimeslot, setSelectedTimeslot] = useState<TimeslotType[]>([]);

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

  const addRoomClickHandler = () => {
    if (!validate()) {
      return;
    }
    const roomCap = Number(roomCapacity);
    Room.create({
      name: roomName,
      capacity: roomCap,
      BuildingId: context.selectedBuildingId,
      notAvailableTimeSlot: selectedTimeslot.map((t) => t.id),
    })
      .then(() => {
        setroomName('');
        setroomCapacity('');
        setSelectedTimeslot([]);
        context.onAddRoomHandler();
      })
      .catch((e) => setshowToast(true));
  };

  const loadTimeslot = () => {
    settimeslotList(getWorkingDaysState());
  };

  useEffect(() => {
    loadTimeslot();
  }, []);

  const handleTimeslotSelected = (timeslotId: string) => {
    if (timeslotId === '-1') {
      return;
    }
    setSelectedTimeslot([
      ...selectedTimeslot,
      timeslotList.timeSlots.find((t) => t.id === timeslotId) as TimeslotType,
    ]);
  };

  const handleTimeslotDeselected = (timeslotId: string) => {
    if (timeslotId === '-1') {
      return;
    }

    setSelectedTimeslot([
      ...selectedTimeslot.filter((s) => s.id !== timeslotId),
    ]);
  };

  const getTimeslotLabel = (t: TimeslotType): string => {
    const label = `${t.startTime.hour}:${t.startTime.minute} ${
      t.AM ? 'AM' : 'PM'
    } -
      ${t.endTime.hour}:${t.endTime.minute} ${t.AM ? 'AM' : 'PM'}`;
    return label;
  };

  return (
    <div className={styles.addBuildingWrap}>
      {showToast && <ToastMsg />}

      <div className="d-flex justify-content-between">
        <h5 className="mr-3">Add Room</h5>
        <Button
          className={styles.floatRightBtn}
          variant="success"
          size="sm"
          onClick={() => setdisplayTimeslotSelect(!displayTimeslotSelect)}
        >
          Add Not Available Time
        </Button>
      </div>

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

      {displayTimeslotSelect ? (
        <div className="mb-3">
          <Form>
            <Form.Label
              className="my-1 mr-1"
              htmlFor="inlineFormCustomSelectPref"
            >
              Timeslot
            </Form.Label>
            <Form.Control
              as="select"
              className="my-1 mr-sm-2"
              id="inlineFormCustomSelectPref"
              onChange={(e) => handleTimeslotSelected(e.target.value)}
            >
              <option value={-1}>Select Timeslot</option>
              {timeslotList.timeSlots.map((t) => (
                <option key={t.id} value={t.id}>
                  {getTimeslotLabel(t as TimeslotType)}
                </option>
              ))}
            </Form.Control>
          </Form>
          <div className="d-block">
            <div className="d-flex">
              {selectedTimeslot.map((s) => (
                <Chip
                  id={s.id}
                  key={s.id}
                  text={getTimeslotLabel(s)}
                  removeClickHandler={handleTimeslotDeselected}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}
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
