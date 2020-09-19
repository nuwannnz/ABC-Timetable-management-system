/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import TimeSlotDialog from '../components/timeslots/TimeSlotDialog';
import { formatTime } from '../utils/formatters';
import {
  WorkingDaysType,
  defaultWorkingDaysState,
  getWorkingDaysState,
  saveWorkingDaysState,
  IIndexable,
} from '../utils/workingDaysDB';

export default function WorkingDaysPage() {
  const [workingDaysState, setWorkingDaysState] = useState<WorkingDaysType>(
    defaultWorkingDaysState
  );

  const [displayDialog, setDisplayDialog] = useState(false);

  const loadWorkingDays = () => {
    const state = getWorkingDaysState();
    setWorkingDaysState(state);
  };

  useEffect(() => {
    loadWorkingDays();
  }, []);

  const handleWorkingDayCheckChanged = (day: string, checked: boolean) => {
    (workingDaysState.workingDays as IIndexable)[day] = checked;
    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;
    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
  };

  const handleWorkingHoursChanged = (hours: number) => {
    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;
    newState.workingTimePerDay.hours = hours;
    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
  };

  const handleWorkingMinutesChanged = (minutes: number) => {
    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;
    newState.workingTimePerDay.minutes = minutes;
    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
  };

  const handleDeleteTimeSlot = (slotId: string) => {
    if (!confirm('Delete this timeslot permanantly?')) {
      return;
    }

    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;
    newState.timeSlots = newState.timeSlots.filter((t) => t.id !== slotId);
    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
  };

  const handleTimeSlotDialogSubmit = (timeslotDao: any) => {
    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;

    newState.timeSlots.push(timeslotDao);
    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
    setDisplayDialog(false);
  };

  const handleNumWorkingDaysChange = (newVal: number) => {
    const newState = Object.fromEntries(
      Object.entries(workingDaysState)
    ) as WorkingDaysType;

    newState.numWorkingDays = newVal;

    setWorkingDaysState({ ...newState });
    saveWorkingDaysState(newState);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Working days and time</h2>
      </div>

      <Row className="mb-3">
        <Col>
          <span>Number of working days per week</span>
        </Col>
        <Col>
          <Form.Control
            as="select"
            value={workingDaysState.numWorkingDays}
            onChange={(e) => {
              handleNumWorkingDaysChange(parseInt(e.target.value, 10));
            }}
          >
            <option value={-1}>Select number of working days</option>

            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <span>Working days of the week</span>
        </Col>
        <Col>
          {Object.entries(workingDaysState.workingDays).map((d, i) => (
            <Form.Check
              key={d[0]}
              inline
              label={d[0]}
              type="checkbox"
              id={d[0]}
              checked={d[1]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleWorkingDayCheckChanged(d[0], e.target.checked as boolean)
              }
            />
          ))}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <span>Working times per day</span>
        </Col>
        <Col>
          <Row>
            <Col>
              <Form.Control
                as="select"
                value={workingDaysState.workingTimePerDay.hours}
                onChange={(e) =>
                  handleWorkingHoursChanged(parseInt(e.target.value, 10))
                }
              >
                {[...Array(22).keys()]
                  .map((h) => h + 1)
                  .map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
              </Form.Control>
            </Col>
            <Col>
              <Form.Control
                as="select"
                value={workingDaysState.workingTimePerDay.minutes}
                onChange={(e) =>
                  handleWorkingMinutesChanged(parseInt(e.target.value, 10))
                }
              >
                {[...Array(58).keys()]
                  .map((m) => m + 1)
                  .map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </Form.Control>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <span>Timeslots</span>
        </Col>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Start time</th>
                <th>End time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workingDaysState.timeSlots.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>
                    {formatTime(t.startTime.hour)}.
                    {formatTime(t.startTime.minute)} {t.AM ? 'am' : 'pm'}
                  </td>
                  <td>
                    {formatTime(t.endTime.hour)}.{formatTime(t.endTime.minute)}{' '}
                    {t.AM ? 'am' : 'pm'}
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTimeSlot(t.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setDisplayDialog(true)}
          >
            Add new timeslot
          </Button>
        </Col>
      </Row>

      {displayDialog && (
        <TimeSlotDialog
          closeClickHandler={() => setDisplayDialog(false)}
          show={displayDialog}
          onSubmit={handleTimeSlotDialogSubmit}
        />
      )}
    </div>
  );
}
