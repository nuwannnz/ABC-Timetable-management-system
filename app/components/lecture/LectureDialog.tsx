/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Lecture from '../../entity/Lecture';
import Faculty from '../../entity/Faculty';
import Department from '../../entity/Department';
import Center from '../../entity/Center';
import Building from '../../entity/Building';
import { LectureLevels } from '../../containers/LecturePage';
import FacultySelect from './FacultySelect';
import DepartmentSelect from './DepartmentSelect';
import CenterSelect from './CenterSelect';

type LectureDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  lecture?: Lecture | null;
  onSubmit: (lecture: any) => void;
};
function LectureDialog({
  show,
  closeClickHandler,
  onSubmit,
  lecture,
}: LectureDialogProps) {
  const [buildingList, setBuildingList] = useState<Building[]>([]);

  const [faculty, setFaculty] = useState(
    lecture ? (lecture as any).Faculty.id : null
  );
  const [department, setDepartment] = useState(
    lecture ? (lecture as any).Department.id : null
  );
  const [center, setCenter] = useState(
    lecture ? (lecture as any).Center.id : null
  );
  const [building, setBuilding] = useState(
    lecture ? (lecture as any).Building.id : null
  );
  const [fName, setFName] = useState(lecture ? (lecture as any).fName : '');
  const [lName, setLName] = useState(lecture ? (lecture as any).lName : '');
  const [level, setLevel] = useState(lecture ? (lecture as any).level : -1);

  const [errorMsg, setErrorMsg] = useState('');
  const loadData = () => {
    Building.findAll()
      .then((result) => setBuildingList(result))
      .catch(() => console.log('failed to load buildings'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const validate = () => {
    let isValid = true;
    // console.log({
    //   fName,
    //   lName,
    //   level,
    //   faculty,
    //   center,
    //   department,
    //   building,
    // });
    if (fName.length === 0 || lName.length === 0) {
      isValid = false;
    }
    if (
      !(faculty as number) ||
      !(center as number) ||
      !(department as number) ||
      !(building as number)
    ) {
      isValid = false;
    }
    if (
      faculty === '-1' ||
      center === '-1' ||
      department === '-1' ||
      building === '-1'
    ) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All the fields are required !');
      return;
    }
    setErrorMsg('');

    const lec = {
      id: lecture ? (lecture as any).id : null,
      fName,
      lName,
      level,
      BuildingId: building,
      CenterId: center,
      FacultyId: faculty,
      DepartmentId: department,
    };
    onSubmit(lec);
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{lecture ? 'Update' : 'Add'} lecture</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="firstName">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  onChange={(e) => setFName(e.target.value)}
                  value={fName}
                  type="text"
                  placeholder="Enter first name here"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="lastName">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  onChange={(e) => setLName(e.target.value)}
                  value={lName}
                  type="text"
                  placeholder="Enter last name here"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="level">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setLevel(e.target.value)}
                  value={level}
                >
                  <option value={-1}>Select a level</option>

                  {LectureLevels.map((l) => (
                    <option key={l.level} value={l.level}>
                      {l.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <FacultySelect
                onFacultySelected={(f) => setFaculty(f)}
                selectedFacultyId={faculty}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <DepartmentSelect
                onDepartmentSelected={(d) => setDepartment(d)}
                selectedDepartmentId={department}
              />
            </Col>
            <Col>
              <CenterSelect
                onCenterSelected={(c) => setCenter(c)}
                selectedCenterId={center}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="building">
                <Form.Label>Building</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setBuilding(e.target.value)}
                  value={building}
                >
                  <option value={-1}>Select a building</option>

                  {buildingList.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col />
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
          {lecture ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LectureDialog;
