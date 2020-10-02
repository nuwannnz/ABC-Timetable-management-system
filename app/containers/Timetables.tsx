/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React from 'react';
import { Button } from 'react-bootstrap';

export default function TimetablePage() {
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Timetables</h2>
        <Button className="ml-3" size="sm" variant="primary">
          Generate timetables
        </Button>
      </div>
    </div>
  );
}
