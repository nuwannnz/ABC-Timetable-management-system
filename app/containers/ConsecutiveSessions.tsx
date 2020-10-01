/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable spaced-comment */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import ConsecutiveDialog, { ConsecutiveSessionType } from '../components/session/ConsecutiveDialog';
import ConsecutiveSession from '../entity/ConsecutiveSession';
import Session from '../entity/Session';

export default function ConsecutiveSessions() {

  const [displayDialog, setDisplayDialog] = useState(false);
  const [conSessionToUpdate, setConSessionToUpdate] = useState<ConsecutiveSession | null>(null);
  const [conSessionList, setConSessionList] = useState<ConsecutiveSession[]>([]);

  const loadConSessions = async () => {
    const conSession = await ConsecutiveSession.findAll({
      include: [{ all: true, nested: true }],
    });
    setConSessionList([...conSession]);
  };

  const handleConSessionDialogSubmit = (consectiveSession: ConsecutiveSession) => {
    if((consectiveSession as any).id ) {
      //update
      ConsecutiveSession.update({...consectiveSession}, {where: {id: (consectiveSession as any).id}})
      .then(() => {
        setDisplayDialog(false);
        setConSessionToUpdate(null);
        loadConSessions();
        return true;

      }).catch((e) => console.log(e));
    } else {
      //create
      console.log(consectiveSession);
      ConsecutiveSession.create({ ...consectiveSession })
      .then(() => {
        loadConSessions();
        setDisplayDialog(false);
        return true;
      })
      .catch((e) => console.log(e));
    }
  }

  const handleConSessionDeleteClick = (consecutiveSession: ConsecutiveSession) => {
    if (confirm('Delete this Session permanently?')) {
      ConsecutiveSession.destroy({ where: { id: (consecutiveSession as any).id } })
        .then(() => loadConSessions())
        .catch((e) => console.log(e));
    }
  };


  useEffect(() => {
    loadConSessions();
  }, []);
  return (

    <div>

      <div className="d-flex align-items-center mb-3">
        <h2>Consecutive sessions</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
        Add consecutive sessions
        </Button>
      </div>
     <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Consecutive Sessions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {conSessionList.map((c: any) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.conSessions.map((s: any)  => (
                <td>{s.sessions}</td>
              ))}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setConSessionToUpdate(c);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleConSessionDeleteClick(c)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {displayDialog && (
        <ConsecutiveDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);

          }}
          onSubmit={handleConSessionDialogSubmit}
          consectiveSession={conSessionToUpdate}
        />
      )}
    </div>
  );
}
