/* eslint-disable prettier/prettier */
import React, { useState} from 'react';
import { Button, Table } from 'react-bootstrap';
import {
  WorkingDaysType,
  defaultWorkingDaysState,
  getWorkingDaysState,
} from '../utils/workingDaysDB';



export default function TimeTablePage() {
  const [workingDaysState, setWorkingDaysState] = useState<WorkingDaysType>(
    defaultWorkingDaysState
  );

  const loadWorkingDays = () => {
    const state = getWorkingDaysState();
    setWorkingDaysState(state);
  };

  // eslint-disable-next-line prettier/prettier
/*
  const [timeSlot, setTimeSlot] = useState([][]);
  useEffect(() => {
    let TimeSlotArr = [][];
    for (var i=0; i <= workingDaysState.numWorkingDays ; i++){
      TimeSlotArr[i].push("1");
      for(var j=0; j <= workingDaysState.timeSlots.length; j++){
        TimeSlotArr[i][j].push("1")
      }
    }
    setTimeSlot(TimeSlotArr);
  }, []);
*/
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Time Tables</h2>
        <Button
          // onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Generate TimeTable
        </Button>

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th> </th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
              <td>3</td>
              <td>4</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}
