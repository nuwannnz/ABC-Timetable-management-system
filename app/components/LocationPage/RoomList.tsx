/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import styles from './LocationPage.css';
import RoomCard from './RoomCard';

export default function RoomList() {
  return (
    <div className={styles.addBuildingWrap}>
      <div>
        <h5>Room Details</h5>
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
        <RoomCard />
      </div>
    </div>
  );
}
