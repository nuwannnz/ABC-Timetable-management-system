/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Room from '../../entity/Room';
import Subject from '../../entity/Subject';

type TagRoomDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  subject?: Subject | null;
  onSubmit: () => void;
};

type ChipPropType = {
  id: number;
  text: string;
  removeClickHandler: (id: number) => void;
};
const Chip = ({ id, removeClickHandler, text }: ChipPropType) => (
  <Button variant="info" size="sm" className="m-2">
    {text}
    <Badge
      variant="light"
      className="ml-2"
      onClick={() => removeClickHandler(id)}
    >
      X
    </Badge>
  </Button>
);

export default function SubjectRoomsDialog({
  closeClickHandler,
  show,
  subject = null,
  onSubmit,
}: TagRoomDialogProps) {
  const [subjectList, setSubjectList] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    subject
  );
  const [roomList, setroomList] = useState<Room[]>([]);
  const [selectedroomList, setSelectedroomList] = useState<Room[]>(
    subject ? subject.get().Rooms : []
  );
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    (async () => {
      const subjects = await Subject.findAll();
      setSubjectList(subjects);
    })();
    (async () => {
      const rooms = await Room.findAll();
      setroomList(rooms);
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubjectSelected = (subjectId: number) => {
    if (subjectId === -1) {
      setSelectedSubject(null);
      return;
    }
    setSelectedSubject(
      subjectList.find((s) => s.get().id === subjectId) as Subject
    );
  };

  const handleRoomSelected = (roomId: number) => {
    if (roomId === -1) {
      return;
    }
    setSelectedroomList([
      ...selectedroomList,
      roomList.find((r) => r.get().id === roomId) as Room,
    ]);
  };

  const handleRoomDeselected = (roomId: number) => {
    if (roomId === -1) {
      return;
    }
    setSelectedroomList([
      ...selectedroomList.filter((s) => s.get().id !== roomId),
    ]);
  };

  const validate = (): boolean => {
    let isValid = true;
    if (selectedroomList.length === 0) {
      isValid = false;
    }
    if (selectedSubject === null) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All fields are required');
      return;
    }
    (async () => {
      if (subject) {
        await (selectedSubject as any).removeRooms(
          selectedSubject?.get().Rooms
        );
      }
      await (selectedSubject as any).addRooms(selectedroomList);
      onSubmit();
    })();
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{subject ? 'Update' : 'Add'} Prefered Subject</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form inline>
                <Form.Label
                  className="my-1 mr-1"
                  htmlFor="inlineFormCustomSelectPref"
                >
                  Subject
                </Form.Label>
                <Form.Control
                  disabled={subject !== null}
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  value={selectedSubject ? selectedSubject.get().id : -1}
                  onChange={(e) =>
                    handleSubjectSelected(parseInt(e.target.value, 10))
                  }
                >
                  <option value={-1}>Select Subject</option>
                  {subjectList.map((s) => (
                    <option value={s.get().id} key={s.get().id}>
                      {s.get().name}
                    </option>
                  ))}
                </Form.Control>
              </Form>
            </Col>
            <Col>
              <Form inline>
                <Form.Label
                  className="my-1 mr-1"
                  htmlFor="inlineFormCustomSelectPref"
                >
                  Rooms
                </Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  onChange={(e) =>
                    handleRoomSelected(parseInt(e.target.value, 10))
                  }
                >
                  <option value={-1}>Select Rooms</option>
                  {roomList
                    .filter(
                      (r) =>
                        !selectedroomList
                          .map((s) => s.get().id)
                          .includes(r.get().id)
                    )
                    .map((r) => (
                      <option key={r.get().id} value={r.get().id}>
                        {r.get().name}({r.get().capacity})
                      </option>
                    ))}
                </Form.Control>
              </Form>
              <div className="d-block">
                <div className="d-flex">
                  {selectedroomList.map((s) => (
                    <Chip
                      id={s.get().id}
                      key={s.get().id}
                      text={s.get().name}
                      removeClickHandler={handleRoomDeselected}
                    />
                  ))}
                </div>
              </div>
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
          {subject ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
