/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Room from '../../entity/Room';
import StudentBatch from '../../entity/StudentBatch';
import Tag from '../../entity/Tag';

type TagRoomDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  tag?: Tag | null;
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

export default function StudentBatchRoomsDialog({
  closeClickHandler,
  show,
  tag = null,
  onSubmit,
}: TagRoomDialogProps) {
  const [batchList, setBatchList] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(tag);
  const [roomList, setroomList] = useState<Room[]>([]);
  const [selectedroomList, setSelectedroomList] = useState<Room[]>(
    tag ? tag.get().Rooms : []
  );
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    (async () => {
      const batches = await StudentBatch.findAll();
      setBatchList(batches);
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTagSelected = (tagId: number) => {
    // if (tagId === -1) {
    //   setSelectedTag(null);
    //   return;
    // }
    // setSelectedTag(tagList.find((x) => x.get().id === tagId) as Tag);
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
    if (selectedTag === null) {
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
      if (tag) {
        await (selectedTag as any).removeRooms(selectedTag?.get().Rooms);
      }
      await (selectedTag as any).addRooms(selectedroomList);
      onSubmit();
    })();
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{tag ? 'Update' : 'Add'} Tag</Modal.Title>
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
                  Tag
                </Form.Label>
                <Form.Control
                  disabled={tag !== null}
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  value={selectedTag ? selectedTag.get().id : -1}
                  onChange={(e) =>
                    handleTagSelected(parseInt(e.target.value, 10))
                  }
                >
                  <option value={-1}>Select Tag</option>
                  {/* {tagList.map((t) => (
                    <option value={t.get().id} key={t.get().id}>
                      {t.get().name}
                    </option>
                  ))} */}
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
          {tag ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
