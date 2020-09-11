/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import styles from './LocationPage.css';
import BuildingCard from './BuildingCard';
import Building from '../../entity/Building';

type BuildingListType = {
  buildingList: Building[];
  onBuildingEdit: (e: Building) => void;
};

export default function BuildingList({
  buildingList,
  onBuildingEdit,
}: BuildingListType) {
  const onEditClickHandler = (building: Building) => {
    onBuildingEdit(building);
  };

  return (
    <div className={styles.addBuildingWrap}>
      <div>
        <h5>Building Details</h5>
        <label htmlFor="basic-url">Search</label>
        <InputGroup className="mb-3">
          <FormControl aria-label="Search" />
          <InputGroup.Append>
            <InputGroup.Text>
              <i className="fas fa-search" />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        {buildingList.map((b: any) => (
          <BuildingCard
            key={b.id}
            building={b}
            onEditClick={onEditClickHandler}
          />
        ))}
      </div>
    </div>
  );
}
