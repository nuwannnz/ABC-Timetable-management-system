/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState } from 'react';
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Programme from '../../entity/Programme';

type ProgrammeDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  programme?: Programme | null;
  onSubmit: (programme: any) => void;
};

export default function ProgrammeDialog({
  closeClickHandler,
  show,
  programme,
  onSubmit,
}: ProgrammeDialogProps) {
  const [name, setName] = useState(programme ? (programme as any).name : '');
  const [code, setCode] = useState(programme ? (programme as any).code : '');

  const [errorMsg, setErrorMsg] = useState('');

  const validate = (): boolean => {
    let isValid = true;
    if (name.length === 0 || code.length === 0) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All the fields are required');
      return;
    }

    const programmeDao = {
      id: programme ? (programme as any).id : null,
      name,
      code,
    };
    onSubmit(programmeDao);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{programme ? 'Update' : 'Add'} Programme</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="programmeCode">
                <Form.Label>Programme Code</Form.Label>
                <Form.Control
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  type="text"
                  placeholder="Enter programme code here"
                />
              </Form.Group>
              <Form.Group controlId="programmeName">
                <Form.Label>Programme name</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter programme name here"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              {errorMsg.length > 0 && (
                <Alert variant="danger">{errorMsg}</Alert>
              )}
            </Col>
          </Row>
        </>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
          {programme ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
