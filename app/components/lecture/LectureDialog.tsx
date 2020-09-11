/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
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
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [centerList, setCenterList] = useState<Center[]>([]);
  const [buildingList, setBuildingList] = useState<Building[]>([]);

  const [faculty, setFaculty] = useState(
    lecture ? (lecture as any).faculty : null
  );
  const [department, setDepartment] = useState(
    lecture ? (lecture as any).department : null
  );
  const [center, setCenter] = useState(
    lecture ? (lecture as any).center : null
  );
  const [building, setBuilding] = useState(
    lecture ? (lecture as any).uilding : null
  );
  const [fName, setFName] = useState(lecture ? (lecture as any).fName : '');
  const [lName, setLName] = useState(lecture ? (lecture as any).lName : '');
  const [level, setLevel] = useState(lecture ? (lecture as any).level : -1);

  const loadData = () => {
    Faculty.findAll()
      .then((result) => setFacultyList(result))
      .catch(() => console.log('failed to load faculties'));
    Department.findAll()
      .then((result) => setDepartmentList(result))
      .catch(() => console.log('failed to load departments'));
    Center.findAll()
      .then((result) => setCenterList(result))
      .catch(() => console.log('failed to load centers'));
    Building.findAll()
      .then((result) => setBuildingList(result))
      .catch(() => console.log('failed to load buildings'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveBtnClickHandler = () => {};
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
                  {LectureLevels.map((l) => (
                    <option key={l.level} value={l.level}>
                      {l.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              {/* <Form.Group controlId="faculty">
                <Form.Label>Faculty</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setFaculty(e.target.value)}
                  value={faculty}
                >
                  {facultyList.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}
              <FacultySelect
                onFacultySelected={(f) => setFaculty(f)}
                selectedFacultyId={faculty}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              {/* <Form.Group controlId="department">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department}
                >
                  {departmentList.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}
              <DepartmentSelect
                onDepartmentSelected={(d) => setDepartment(d)}
                selectedDepartmentId={department}
              />
            </Col>
            <Col>
              {/* <Form.Group controlId="center">
                <Form.Label>Center</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setCenter(e.target.value)}
                  value={center}
                >
                  {centerList.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group> */}
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
                  value={center}
                >
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
