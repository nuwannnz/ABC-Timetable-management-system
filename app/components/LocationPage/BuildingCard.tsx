/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import styles from './LocationPage.css';
import Building from '../../entity/Building';
import { LocationPageContext } from '../../containers/LocationPage';

type BuildingCardType = {
  building: Building;
  onEditClick: (e: Building) => void;
};

export default function BuildingCard({
  building,
  onEditClick,
}: BuildingCardType) {
  const context = useContext(LocationPageContext);

  return (
    <div className={styles.bCardWrap}>
      <div className="d-flex">
        <p>Building Name: </p>
        <p className={styles.bInputValue}>{(building as any).name}</p>
      </div>
      <div className={styles.bCardBtn}>
        <Button
          className="mr-2"
          variant="secondary"
          size="sm"
          onClick={() => onEditClick(building)}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => context.onDeleteBuildingHandler((building as any).id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
