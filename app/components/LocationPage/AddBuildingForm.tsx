/* eslint-disable promise/always-return */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import styles from './LocationPage.css';
import Building from '../../entity/Building';
import ToastMsg from './ToastMsg';

type AddBuildingFormType = { onAddBuilding: () => void };

export default function AddBuildingForm({
  onAddBuilding,
}: AddBuildingFormType) {
  const [buildingName, setbuildingName] = useState('');
  const [nameValid, setnameValid] = useState(false);

  const addBuildingClickHandler = () => {
    if (buildingName.length === 0) {
      setnameValid(true);
      return;
    }
    Building.create({ name: buildingName })
      .then(() => {
        setbuildingName('');
        onAddBuilding();
      })
      .catch(() => console.log('Fail to add!'));
  };

  return (
    <div className={styles.addBuildingWrap}>
      <h5>Add Building</h5>

      <label htmlFor="basic-url">Building Name</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          value={buildingName}
          onChange={(e) => setbuildingName(e.target.value)}
        />
      </InputGroup>

      {nameValid && <Alert variant="danger">Building Name is required!</Alert>}

      <div>
        <Button
          className={styles.floatRightBtn}
          variant="primary"
          onClick={addBuildingClickHandler}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
