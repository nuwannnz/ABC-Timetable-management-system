/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component, useEffect, useState } from 'react'
import Session from '../../entity/Session';
import { v4 as uuidv4 } from 'uuid';
import { UUIDV4 } from 'sequelize/types';
import { Button, Col, Form, InputGroup, Modal, Row, Table } from 'react-bootstrap';

type ParallelDialogProps = {
  closeClickHandler: () => void;
  show: boolean;
  // eslint-disable-next-line react/require-default-props
  parallelSession?: Session | null;
  onSubmit: (session:any) => void;
};

export type ParallelSessionType = {
  id: string;
  sessions: Session[];

};

export default function ParallelDialog({closeClickHandler, show,
  parallelSession,
  onSubmit}: ParallelDialogProps) {

    const [session, setSession] = useState(
      parallelSession ? (parallelSession as any).session : -1
    );
    const [sessionToEdit, setSessionToEdit] = useState<ParallelSessionType | null>(null);
    const [sessionList, setSessionList] = useState<Session[]>([]);
    const [parSessions, setParSessions] = useState<ParallelSessionType[]>(
      parallelSession ? (parallelSession as any).sessions : []
    );

    const loadSessions = async () => {
      const s = await Session.findAll({
        include: [{ all: true, nested: true }],
      });
      setSessionList([...s]);
    };
    useEffect(() => {
      loadSessions();
    }, []);

    const saveBtnClickHandler = () => {
      // if (!validate()) {
      //   setErrorMsg('Tag name is required');
      //   return;
      // }

      const parSessionDao = {
        id: parallelSession ? (parallelSession as any).id : null,
        parSessions,
      };

      console.log(parSessionDao);
      onSubmit(parSessionDao);
    };

    const handleSessionEdit = () => {
      const newGroups = parSessions.map((c) => {
        if (c.id === (sessionToEdit as ParallelSessionType).id) {
          //c.sessions = parseInt(12, 10);
        }
        return c;
      });

      setParSessions([...newGroups]);
      setSessionToEdit(null);
      setSession('');
    };

    const addSessionsClickHandler = () => {
      if (session.length === 0) {
        return;
      }
      setParSessions([
        ...parSessions,
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
        <Modal.Title>{parallelSession ? 'Update' : 'Add'} parallel Session</Modal.Title>
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
                    disabled={
                      session.length === 0
                    }
                  >
                    {sessionToEdit ? 'Save' : '+'}
                  </Button>
                </InputGroup.Append>
                </InputGroup>

              </Form.Group>

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
          {parSessions.map((c: any) => (
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
        </>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeClickHandler}>
          Close
        </Button>
        <Button variant="primary" onClick={() => saveBtnClickHandler()}>
          {parallelSession ? 'Save' : 'create'}
        </Button>
      </Modal.Footer>
      </Modal>
    )

}
