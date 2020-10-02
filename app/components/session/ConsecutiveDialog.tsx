/* eslint-disable react/jsx-curly-newline */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import React, { Component, useState, useEffect, useRef } from 'react';
import {
  Alert,
  Button,
  Col,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { UUIDV4 } from 'sequelize/types';
import Session from '../../entity/Session';
import Room from '../../entity/Room';

type ConsecutiveDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  consectiveSession?: Session | null;
  onSubmit: (session: any) => void;
};

export type ConsecutiveSessionType = {
  id: string;
  sessions: Session[];
};

export default function ConsecutiveDialog({
  closeClickHandler,
  show,
  consectiveSession,
  onSubmit,
}: ConsecutiveDialogProps) {
  const [session, setSession] = useState(
    consectiveSession ? (consectiveSession as any).session : -1
  );
  const [
    sessionToEdit,
    setSessionToEdit,
  ] = useState<ConsecutiveSessionType | null>(null);
  const [sessionList, setSessionList] = useState<Session[]>([]);
  const [roomList, setroomList] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number>(-1);

  const [conSessions, setConSessions] = useState<ConsecutiveSessionType[]>(
    consectiveSession ? (consectiveSession as any).sessions : []
  );
  const [errorMsg, setErrorMsg] = useState('');

  const loadSessions = async () => {
    const s = await Session.findAll({
      include: [{ all: true, nested: true }],
    });
    setSessionList([...s]);
  };
  useEffect(() => {
    loadSessions();
  }, []);

  const loadData = () => {
    (async () => {
      const rooms = await Room.findAll();
      setroomList(rooms);
    })();
  };

  useEffect(() => {
    loadData();
  }, []);

  const validate = (): boolean => {
    let isValid = true;
    if (session.length === null) {
      isValid = false;
    }
    return isValid;
  };

  const saveBtnClickHandler = () => {
    if (!validate()) {
      setErrorMsg('Session is required');
      return;
    }

    const conSessionDao = {
      id: consectiveSession ? (consectiveSession as any).id : null,
      conSessions,
      RoomId: selectedRoomId,
    };

    console.log(conSessionDao);
    onSubmit(conSessionDao);
  };

  const handleSessionEdit = () => {
    const newGroups = conSessions.map((c) => {
      if (c.id === (sessionToEdit as ConsecutiveSessionType).id) {
        c.sessions = session;
      }
      return c;
    });

    setConSessions([...newGroups]);
    setSessionToEdit(null);
    setSession('');
  };

  const addSessionsClickHandler = () => {
    if (session.length === 0) {
      return;
    }
    setConSessions([
      ...conSessions,
      {
        id: uuidv4(),
        sessions: session,
      },
    ]);
    setSession('');
  };

  return (
    <Modal show={show} size="lg" onHide={() => closeClickHandler()} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {consectiveSession ? 'Update' : 'Add'} Consecutive Session
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <>
          <Row>
            <Col>
              <Form.Group controlId="session">
                <Form.Label>Select Session</Form.Label>
                <InputGroup>
                  <Form.Control
                    as="select"
                    onChange={(e) => setSession(e.target.value)}
                    value={session}
                  >
                    <option value={-1}>Select a session</option>
                    {sessionList.map((s: any) => (
                      <option key={s.id} value={(s as any).Subject.name}>
                        {(s as any).Subject.name}
                      </option>
                    ))}
                  </Form.Control>
                  <InputGroup.Append>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (sessionToEdit) {
                          handleSessionEdit();
                        } else {
                          addSessionsClickHandler();
                        }
                      }}
                      variant="outline-secondary"
                      disabled={session.length === 0}
                    >
                      {sessionToEdit ? 'Save' : '+'}
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form>
                <Form.Label
                  className="my-1 mr-1"
                  htmlFor="inlineFormCustomSelectPref"
                >
                  Room
                </Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  defaultValue={selectedRoomId}
                  onChange={(e) =>
                    setSelectedRoomId(parseInt(e.target.value, 10))
                  }
                >
                  <option value={-1}>Select a Room</option>
                  {roomList.map((r) => (
                    <option key={r.get().id} value={r.get().id}>
                      {r.get().name}({r.get().capacity})
                    </option>
                  ))}
                </Form.Control>
              </Form>
            </Col>
          </Row>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>sessions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {conSessions.map((c: any) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.sessions}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        variant="danger"
                        size="sm"
                        //onClick={() => handleTagDeleteClick(t)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
          {consectiveSession ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
