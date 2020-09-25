/* eslint-disable no-restricted-globals */
/* eslint-disable no-alert */
import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import ProgrammeDialog from '../components/programme/ProgrammeDialog';
import Programme from '../entity/Programme';

export default function ProgrammePage() {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [programmeList, setProgrammeList] = useState<Programme[]>([]);
  const [programmeToUpdate, setProgrammeToUpdate] = useState<Programme | null>(
    null
  );

  const loadProgrammes = async () => {
    const programmes = await Programme.findAll();
    setProgrammeList([...programmes]);
  };

  const handleProgrammeDialogSubmit = (programme: Programme) => {
    if ((programme as any).id) {
      // update
      Programme.update(
        { ...programme },
        { where: { id: (programme as any).id } }
      )
        .then(() => {
          setDisplayDialog(false);
          setProgrammeToUpdate(null);
          loadProgrammes();
          return true;
        })
        .catch((e) => console.log(e));
    } else {
      // create
      Programme.create({ ...programme })
        .then(() => {
          loadProgrammes();
          setDisplayDialog(false);
          return true;
        })
        .catch((e) => console.log(e));
    }
  };

  const handleProgrammeDeleteClick = (programme: Programme) => {
    if (confirm('Delete this programme permanently?')) {
      Programme.destroy({ where: { id: (programme as any).id } })
        .then(() => loadProgrammes())
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    loadProgrammes();
  }, []);
  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h2>Programmes</h2>
        <Button
          onClick={() => setDisplayDialog(!displayDialog)}
          className="ml-3"
          size="sm"
          variant="primary"
        >
          Add new programme
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Programme code</th>
            <th>Programme name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {programmeList.map((p: any) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    className="mr-1"
                    variant="info"
                    size="sm"
                    onClick={() => {
                      setProgrammeToUpdate(p);
                      setDisplayDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleProgrammeDeleteClick(p)}
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
        <ProgrammeDialog
          show={displayDialog}
          closeClickHandler={() => {
            setDisplayDialog(false);
            setProgrammeToUpdate(null);
          }}
          onSubmit={handleProgrammeDialogSubmit}
          programme={programmeToUpdate}
        />
      )}
    </div>
  );
}
