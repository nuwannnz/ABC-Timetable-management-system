/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { Alert, Badge, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Programme from '../../entity/Programme';
import Room from '../../entity/Room';
import StudentBatch from '../../entity/StudentBatch';
import {
  defaultPreferedRoomsState,
  getPreferedRoomsState,
  PreferedRoomsType,
  savePreferedRoomsState,
} from '../../utils/preferedRoomsDB';

export type GroupEditPara = {
  groupId: string;
  roomIds: number[];
};

type GroupRoomDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  group?: GroupEditPara | null;
  onSubmit: () => void;
};

export type GroupSelectItemType = {
  groupId: string;
  label: string;
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
  group = null,
  onSubmit,
}: GroupRoomDialogProps) {
  const [batchList, setBatchList] = useState<StudentBatch[]>([]);
  const [groupList, setgroupList] = useState<GroupSelectItemType[]>([]);
  const [roomList, setroomList] = useState<Room[]>([]);
  const [selectedroomList, setSelectedroomList] = useState<Room[]>([]);
  const [selectedGroupId, setselectedGroupId] = useState<string | null>(
    group ? group.groupId : null
  );
  const [currentState, setcurrentState] = useState<PreferedRoomsType>(
    defaultPreferedRoomsState
  );
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = () => {
    (async () => {
      const rooms = await Room.findAll();
      setroomList(rooms);
      if (group) {
        setSelectedroomList([
          ...rooms.filter((r) => group.roomIds.includes(r.get().id)),
        ]);
      }
    })();
  };

  useEffect(() => {}, [roomList]);

  useEffect(() => {
    loadData();
  }, []);

  const loadGroups = () => {
    const groupItems: GroupSelectItemType[] = [];
    batchList.forEach((b) => {
      b.get().groups.forEach((g: any) => {
        groupItems.push({
          groupId: g.id,
          label: `Y${b.get().year}.S${b.get().semester}.${
            b.get().Programme.code
          }.${g.groupNumber}`,
        });
        g.subGroups.forEach((s: any) => {
          groupItems.push({
            groupId: s.id,
            label: `Y${b.get().year}.S${b.get().semester}.${
              b.get().Programme.code
            }.${g.groupNumber}.${s.subGroupNumber}`,
          });
        });
      });
    });
    setgroupList(groupItems);
  };

  const loadBatches = () => {
    (async () => {
      const batches = await StudentBatch.findAll({ include: Programme });
      setBatchList(batches);
    })();
  };

  useEffect(() => {
    loadBatches();
  }, []);

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

  const loadCurrentState = () => {
    setcurrentState(getPreferedRoomsState());
  };

  useEffect(() => {
    loadGroups();
    loadCurrentState();
  }, [batchList]);

  const handleSeletedGroup = (groupId: string) => {
    if (groupId === '-1') {
      setselectedGroupId(null);
      return;
    }
    setselectedGroupId(groupId);
  };

  const validate = (): boolean => {
    let isValid = true;
    if (selectedroomList.length === 0) {
      isValid = false;
    }
    if (selectedGroupId === null) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('All fields are required');
      return;
    }

    if (group) {
      // update
      currentState.groupRooms = currentState.groupRooms.map((gr) => {
        if (gr.groupId === group.groupId) {
          // return the updated one
          return {
            groupId: group.groupId,
            roomId: selectedroomList.map((r) => r.get().id),
          };
        }
        return gr;
      });
    } else {
      // create new
      currentState.groupRooms.push({
        groupId: selectedGroupId as string,
        roomId: selectedroomList.map((s) => s.get().id),
      });
    }
    savePreferedRoomsState(currentState);
    onSubmit();
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>{group ? 'Update' : 'Add'} Tag</Modal.Title>
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
                  Groups/Subgroups
                </Form.Label>
                <Form.Control
                  disabled={group !== null}
                  as="select"
                  className="my-1 mr-sm-2"
                  id="inlineFormCustomSelectPref"
                  value={selectedGroupId ? selectedGroupId : '-1'}
                  onChange={(e) => handleSeletedGroup(e.target.value)}
                >
                  <option value={-1}>Select a group or subgroup</option>

                  {groupList.map((g) => (
                    <option key={g.groupId} value={g.groupId}>
                      {g.label}
                    </option>
                  ))}
                </Form.Control>
              </Form>
            </Col>
            <Col>
              <Form>
                <Form.Label
                  className="my-1 mr-1"
                  htmlFor="inlineFormCustomSelectPref"
                >
                  Rooms
                </Form.Label>
                <br />
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
          {group ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
