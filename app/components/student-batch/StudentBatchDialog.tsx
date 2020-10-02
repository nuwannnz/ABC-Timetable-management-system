/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Row,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import Programme from '../../entity/Programme';
import StudentBatch from '../../entity/StudentBatch';

type StudentBatchDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  studentBatch?: StudentBatch | null;
  onSubmit: (studentBatch: any) => void;
};

export type SubGroupType = {
  id: string;
  groupNumber: number;
  subGroupNumber: number;
};

export type GroupType = {
  id: string;
  groupNumber: number;
  subGroups: SubGroupType[];
};

type GroupItemPropType = {
  groupNumber: number;
  subGroups: SubGroupType[];
  onDeleteGroup: (groupId: number) => void;
  onEditGroup: (groupId: number) => void;
  onAddSubGroup: (groupId: number, subGroupId: number) => void;
  onRemoveSubGroup: (groupId: number, subGroupId: number) => void;
};

const GroupItem = ({
  groupNumber,
  subGroups,
  onAddSubGroup,
  onDeleteGroup,
  onEditGroup,
  onRemoveSubGroup,
}: GroupItemPropType) => {
  const [subGroupText, setSubGroupText] = useState<string>('');
  return (
    <>
      <Card className="mt-2 mb-2">
        <Card.Body>
          <Row>
            <Col>
              <div className="d-flex w-100 justify-content-between align-center">
                <span>{groupNumber}</span>
                <div className="d-flex align-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      onEditGroup(groupNumber);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDeleteGroup(groupNumber)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              {subGroups.map((s) => (
                <Card key={s.id} className="mt-2">
                  <Card.Body>
                    <Row>
                      <Col>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            {groupNumber}.{s.subGroupNumber}
                          </span>
                          <div className="d-flex align-center">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                onRemoveSubGroup(groupNumber, s.subGroupNumber)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Text>Add Sub group</Form.Text>
              <InputGroup className="mt-1">
                <FormControl
                  placeholder="Sub group number"
                  size="sm"
                  value={subGroupText}
                  onChange={(e) => setSubGroupText(e.target.value)}
                />
                <InputGroup.Append>
                  <Button
                    size="sm"
                    onClick={() => {
                      onAddSubGroup(groupNumber, parseInt(subGroupText, 10));

                      setSubGroupText('');
                    }}
                    variant="outline-secondary"
                    disabled={subGroupText.length === 0}
                  >
                    +
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
            <Col>
              <></>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default function StudentBatchDialog({
  closeClickHandler,
  show,
  studentBatch,
  onSubmit,
}: StudentBatchDialogProps) {
  const [year, setYear] = useState(
    studentBatch ? (studentBatch as any).year : 0
  );
  const [semester, setSemester] = useState(
    studentBatch ? (studentBatch as any).semester : 0
  );
  const [programme, setProgramme] = useState(
    studentBatch ? (studentBatch as any).programme : -1
  );

  const [groups, setGroups] = useState<GroupType[]>(
    studentBatch ? (studentBatch as any).groups : []
  );
  const [groupToEdit, setGroupToEdit] = useState<GroupType | null>(null);

  const [groupNumberTxt, setGroupNumberTxt] = useState<string>('');

  const [programmeList, setProgrammeList] = useState<Programme[]>([]);

  const [errorMsg, setErrorMsg] = useState('');

  const loadProgrammes = async () => {
    const p = await Programme.findAll();
    setProgrammeList([...p]);
  };
  useEffect(() => {
    loadProgrammes();
  }, []);

  const validate = (): boolean => {
    let isValid = true;
    if (year === 0 || semester === 0) {
      isValid = false;
    }
    if (programme === -1) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All the fields are required');
      return;
    }

    const studentBatchDao = {
      id: studentBatch ? (studentBatch as any).id : null,
      year,
      semester,
      groups,
      ProgrammeId: programme,
    };
    onSubmit(studentBatchDao);
  };

  const addGroupNumberClickHandler = () => {
    if (groupNumberTxt.length === 0 || isNaN(parseInt(groupNumberTxt, 10))) {
      return;
    }
    setGroups([
      ...groups,
      {
        id: uuidv4(),
        groupNumber: parseInt(groupNumberTxt, 10),
        subGroups: [],
      },
    ]);
    setGroupNumberTxt('');
  };

  const handleSubGroupAdd = (gNumber: number, sNumber: number) => {
    const newGroups = groups.map((g) => {
      if (g.groupNumber === gNumber) {
        g.subGroups.push({
          id: uuidv4(),
          groupNumber: g.groupNumber,
          subGroupNumber: sNumber,
        });
      }
      return g;
    });
    setGroups([...newGroups]);
  };

  const handleSubGroupRemove = (gNumber: number, sNumber: number) => {
    const newGroups = groups.map((g) => {
      if (g.groupNumber === gNumber) {
        g.subGroups = g.subGroups.filter((s) => s.subGroupNumber === sNumber);
      }
      return g;
    });
    setGroups([...newGroups]);
  };

  const handleGroupDelete = (gId: string) => {
    setGroups([...groups.filter((g) => g.id !== gId)]);
  };

  const handleGroupEdit = () => {
    const newGroups = groups.map((g) => {
      if (g.id === (groupToEdit as GroupType).id) {
        g.groupNumber = parseInt(groupNumberTxt, 10);
      }
      return g;
    });

    setGroups([...newGroups]);
    setGroupToEdit(null);
    setGroupNumberTxt('');
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {studentBatch ? 'Update' : 'Add'} Student Batch
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="year">
                <Form.Label>Academic Year</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setYear(e.target.value)}
                  value={year}
                >
                  <option value={-1}>Select a year</option>

                  {[1, 2, 3, 4].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="semester">
                <Form.Label>Academic Semester</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setSemester(e.target.value)}
                  value={semester}
                >
                  <option value={-1}>Select a semester</option>

                  {[1, 2].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group controlId="programme">
                <Form.Label>Programme</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setProgramme(e.target.value)}
                  value={programme}
                >
                  <option value={-1}>Select a programme</option>

                  {programmeList.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Label>Group Number (Enter only numbers)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  onChange={(e) => setGroupNumberTxt(e.target.value)}
                  value={groupNumberTxt}
                />
                <InputGroup.Append>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (groupToEdit) {
                        handleGroupEdit();
                      } else {
                        addGroupNumberClickHandler();
                      }
                    }}
                    variant="outline-secondary"
                    disabled={
                      groupNumberTxt.length === 0 ||
                      isNaN(parseInt(groupNumberTxt, 10))
                    }
                  >
                    {groupToEdit ? 'Save' : '+'}
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <span>Groups: </span>
              </div>
              {groups.map((g) => (
                <GroupItem
                  key={g.id}
                  groupNumber={g.groupNumber}
                  subGroups={g.subGroups}
                  onAddSubGroup={handleSubGroupAdd}
                  onRemoveSubGroup={handleSubGroupRemove}
                  onDeleteGroup={(gNum) => {
                    handleGroupDelete(g.id);
                  }}
                  onEditGroup={(gNum) => {
                    setGroupToEdit(g);
                    setGroupNumberTxt(`${g.groupNumber}`);
                  }}
                />
              ))}
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
          {studentBatch ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
