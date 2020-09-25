/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

type TimeSlotDialogPropType = {
  onSubmit: (t: any) => void;
  show: boolean;
  closeClickHandler: () => void;
};

export default function TimeSlotDialog({
  show,
  onSubmit,
  closeClickHandler,
}: TimeSlotDialogPropType) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    if (hour === 0) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = (is30Minutes = false) => {
    if (!validate()) {
      setErrorMsg('Subject code and subject name are required');
      return;
    }

    const timeSlotDao = {
      id: uuidv4(),
      startTime: {
        hour,
        minute,
      },
      endTime: {
        hour: is30Minutes ? hour : hour + 1,
        minute: is30Minutes ? minute + 30 : minute,
      },
      AM: isAM,
    };
    onSubmit(timeSlotDao);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add new timeslot</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <span>Enter starting time</span>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control
                as="select"
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value, 10))}
              >
                <option value={-1}>Hours</option>

                {[...Array(22).keys()]
                  .map((i) => i + 1)
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
                value={minute}
                onChange={(e) => setMinute(parseInt(e.target.value, 10))}
              >
                <option value={-1}>Minutes</option>

                {[...Array(58).keys()]
                  .map((i) => i + 1)
                  .map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
              </Form.Control>
            </Col>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => setIsAM(e.target.value === 'AM')}
              >
                <option value={-1}>AM / PM</option>

                {['AM', 'PM'].map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </Form.Control>
            </Col>
          </Row>

          <Row>
            {errorMsg.length > 0 && <Alert variant="danger">{errorMsg}</Alert>}
          </Row>
        </>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler(true)}>
          Add 30 minute timeslot
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
          Add 1 hour timeslot
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
