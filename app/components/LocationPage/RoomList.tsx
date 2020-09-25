/* eslint-disable import/no-cycle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';
import styles from './LocationPage.css';
import RoomCard from './RoomCard';
import Room from '../../entity/Room';

type RoomListType = {
  roomList: Room[];
};

export default function RoomList({ roomList }: RoomListType) {
  const [searchTxt, setsearchTxt] = useState('');

  return (
    <div className={styles.addBuildingWrap}>
      <div>
        <h5>Room Details</h5>
        <label htmlFor="basic-url">Search</label>
        <InputGroup className="mb-3">
          <FormControl
            aria-label="Search"
            onInput={(e: any) => setsearchTxt(e.target.value)}
          />
          <InputGroup.Append>
            <InputGroup.Text>
              <i className="fas fa-search" />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div>
        {roomList
          .filter((r: any) => r.name.includes(searchTxt))
          .map((r: any) => (
            <RoomCard key={r.id} room={r} />
          ))}
      </div>
    </div>
  );
}
