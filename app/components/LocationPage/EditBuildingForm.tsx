/* eslint-disable promise/always-return */
/* eslint-disable no-alert */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Building from '../../entity/Building';

type EditBuildingFormType = {
  building: Building;
  onBuildingUpdate: () => void;
};

export default function EditBuildingForm({
  building,
  onBuildingUpdate,
}: EditBuildingFormType) {
  const [name, setname] = useState((building as any).name);

  const updateClickHandler = () => {
    if (name.length === 0) {
      alert('Building Name is required!');
      return;
    }
    Building.update({ name }, { where: { id: (building as any).id } })
      .then(() => {
        setname('');
        onBuildingUpdate();
      })
      .catch((e) => alert('Fail to update building'));
  };

  return (
    <div className={styles.addBuildingWrap}>
      <h5>Edit Building</h5>

      <label htmlFor="basic-url">Building Name</label>
      <InputGroup className="mb-3">
        <FormControl
          id="basic-url"
          aria-describedby="basic-addon3"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
      </InputGroup>
      <div>
        <Button
          className={styles.floatRightBtn}
          variant="primary"
          onClick={updateClickHandler}
        >
          Update
        </Button>
      </div>
    </div>
  );
}
