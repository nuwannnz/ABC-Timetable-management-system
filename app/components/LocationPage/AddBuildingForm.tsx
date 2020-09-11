/* eslint-disable promise/always-return */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Building from '../../entity/Building';

type AddBuildingFormType = { onAddBuilding: () => void };

export default function AddBuildingForm({
  onAddBuilding,
}: AddBuildingFormType) {
  const [buildingName, setbuildingName] = useState('');

  const addBuildingClickHandler = () => {
    if (buildingName.length === 0) {
      alert('Building Name is required!');
      return;
    }
    Building.create({ name: buildingName })
      .then(() => {
        setbuildingName('');
        onAddBuilding();
      })
      .catch((e) => alert('Fail to add building'));
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
