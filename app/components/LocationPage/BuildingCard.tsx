/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState, useEffect } from 'react';
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
  const [selected, setSelected] = useState(false);

  const onClickCard = () => {
    context.onSelectBuildingHandler((building as any).id);
    setSelected(!selected);
  };

  useEffect(() => {
    if (context.selectedBuildingId !== (building as any).id) {
      setSelected(false);
    }
  }, [context.selectedBuildingId, building]);
  return (
    <div
      className={styles.bCardWrap}
      style={{ backgroundColor: selected ? '#9E9E9E' : 'gainsboro' }}
      onClick={() => onClickCard()}
    >
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
