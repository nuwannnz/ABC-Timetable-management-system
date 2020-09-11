/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState } from 'react';
import { Modal, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import Subject from '../../entity/Subject';

type SubjectDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  subject?: Subject | null;
  onSubmit: (subject: any) => void;
};

export default function SubjectDialog({
  closeClickHandler,
  show,
  subject,
  onSubmit,
}: SubjectDialogProps) {
  const [code, setCode] = useState(subject ? (subject as any).code : '');
  const [name, setName] = useState(subject ? (subject as any).name : '');
  const [lectureHours, setLectureHours] = useState(
    subject ? (subject as any).lectureHours : 0
  );
  const [tutorialHours, setTutorialHours] = useState(
    subject ? (subject as any).tutorialHours : 0
  );
  const [labHours, setLabHours] = useState(
    subject ? (subject as any).labHours : 0
  );
  const [evaluationHours, setEvaluationHours] = useState(
    subject ? (subject as any).evaluationHours : 0
  );

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
      setErrorMsg('Subject code and subject name are required');
      return;
    }

    const subjectDao = {
      id: subject ? subject.id : null,
      code,
      name,
      lectureHours,
      tutorialHours,
      labHours,
      evaluationHours,
    };
    onSubmit(subjectDao);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{subject ? 'Update' : 'Add'} subject</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="subjectCode">
                <Form.Label>Subject code</Form.Label>
                <Form.Control
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  type="text"
                  placeholder="Enter subject code here"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="subjectName">
                <Form.Label>Subject name</Form.Label>
                <Form.Control
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="Enter subject name here"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="lectureHours">
                <Form.Label>Lecture Hours</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setLectureHours(parseInt(e.target.value, 10))
                  }
                  value={lectureHours}
                  type="number"
                  placeholder="Enter lecture hours here"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="tutorialHours">
                <Form.Label>Tutorial hours</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setTutorialHours(parseInt(e.target.value, 10))
                  }
                  value={tutorialHours}
                  type="number"
                  placeholder="Enter tutorial hours here"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="labHours">
                <Form.Label>Lab hours</Form.Label>
                <Form.Control
                  onChange={(e) => setLabHours(parseInt(e.target.value, 10))}
                  value={labHours}
                  type="number"
                  placeholder="Enter lab hours here"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="evaluationHours">
                <Form.Label>Evaluation Hours</Form.Label>
                <Form.Control
                  onChange={(e) =>
                    setEvaluationHours(parseInt(e.target.value, 10))
                  }
                  value={evaluationHours}
                  type="number"
                  placeholder="Enter evaluation hours here"
                />
              </Form.Group>
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
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
          {subject ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
