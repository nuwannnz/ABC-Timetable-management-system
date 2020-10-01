/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component, useEffect, useState } from 'react'
import { Button, Table } from 'react-bootstrap';
import ParallelDialog from '../components/session/ParallelDialog';
import ParallelSession from '../entity/ParallelSession';

export default function ParallelSessions() {

  const [displayDialog, setDisplayDialog] = useState(false);
  const [parSessionToUpdate, setParSessionToUpdate] = useState<ParallelSession | null>(null);
  const [parSessionList, setParSessionList] = useState<ParallelSession[]>([]);

  const loadParSessions = async () => {
    const parSession = await ParallelSession.findAll({
      include: [{ all: true, nested: true }],
    });
    setParSessionList([...parSession]);
  };

  const handleParSessionDialogSubmit = (parallelSession: ParallelSession) => {
    if((parallelSession as any).id ) {
      //update
      ParallelSession.update({...parallelSession}, {where: {id: (parallelSession as any).id}})
      .then(() => {
        setDisplayDialog(false);
        setParSessionToUpdate(null);
        loadParSessions();
        return true;

      }).catch((e) => console.log(e));
    } else {
      //create
      ParallelSession.create({ ...parallelSession })
      .then(() => {
        loadParSessions();
        setDisplayDialog(false);
        return true;
      })
      .catch((e) => console.log(e));
    }
  }

  const handleParSessionDeleteClick = (parallelSession: ParallelSession) => {
    if (confirm('Delete this Session permanently?')) {
      ParallelSession.destroy({ where: { id: (parallelSession as any).id } })
        .then(() => loadParSessions())
        .catch((e) => console.log(e));
    }
  };


  useEffect(() => {
    loadParSessions();
  }, []);

    return (
      <div>

      <div className="d-flex align-items-center mb-3">
        <h2>Parrallel sessions</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
        Add Parrallel sessions
        </Button>
      </div>
     <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Parrallel Sessions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parSessionList.map((c: any) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.parSessions.map((s: any)  => (
                <td>{s.sessions}</td>
              ))}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setParSessionToUpdate(c);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleParSessionDeleteClick(c)}
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
        <ParallelDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);

          }}
          onSubmit={handleParSessionDialogSubmit}
          parallelSession={parSessionToUpdate}
        />
      )}
    </div>
    )

}
